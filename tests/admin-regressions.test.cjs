const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(path, mocks) {
  const source = readFileSync(path, 'utf8');
  const code = ts.transpileModule(source, { fileName: path, compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText;
  const context = { exports: {}, require(name) {
    if (name in mocks) return mocks[name];
    throw new Error(`Unexpected dependency: ${name}`);
  } };
  vm.runInNewContext(code, context);
  return context.exports;
}
const jsx = (type, props) => ({ type, props });
function nodes(node) {
  if (!node || typeof node !== 'object') return [];
  return [node, ...[node.props?.children].flat().flatMap(nodes)];
}
const toast = Object.assign(() => {}, { success() {}, error() {} });

test('rental mutations refresh inventory, availability and history', () => {
  const keys = [];
  const api = load('src/api/adminRental.api.ts', {
    '@tanstack/react-query': { useQuery() {}, useMutation: options => options,
      useQueryClient: () => ({ invalidateQueries: ({ queryKey }) => keys.push(queryKey[0]) }) },
    './client': { apiClient: {} }, axios: { isAxiosError: () => false }, sonner: { toast },
  });
  for (const name of ['useManualRental', 'useCreateRental', 'useReturnReservation']) {
    keys.length = 0;
    api[name]().onSuccess({ message: 'ok' });
    for (const key of ['admin_items', 'item-available', 'user_rentals', 'admin_rental_history', 'admin_item_occupancy', 'models']) {
      assert.ok(keys.includes(key), `${name} must refresh ${key}`);
    }
  }
});

test('user rental page never exposes fake edit or reservation deletion; returned items cannot be returned again', () => {
  for (const status of ['RENTING', 'OVERDUE', 'RETURNED']) {
    let calls = 0;
    const rental = { rentalId: 91, status, modelName: 'test', itemSerial: 'T-1' };
    const ui = name => new Proxy({}, { get: (_, key) => `${name}:${String(key)}` });
    const Page = load('src/pages/admin/user/User.tsx', {
      react: { useState: () => [91, () => {}], useMemo: fn => fn() },
      'react/jsx-runtime': { jsx, jsxs: jsx },
      'react-router-dom': { useParams: () => ({ userId: '1' }) },
      '../../../components/ui/breadcrumb': ui('breadcrumb'),
      '../../../components/ui/table': ui('table'),
      '../../../components/ui/alert-dialog': ui('dialog'),
      '../../../components/ui/checkbox': ui('checkbox'),
      sonner: { toast },
      '../../../api/admin.api': { useFetchUser: () => ({ data: { username: 'test' } }) },
      '../../../api/adminUser.api': { useUserRentals: () => ({ data: [rental] }) },
      '../../../api/adminRental.api': { useReturnReservation: () => ({ mutate: () => calls++, isPending: false }) },
    }).default;
    const tree = nodes(Page());
    assert.ok(!tree.some(n => n.props?.children === '수정' || n.props?.children === '삭제'));
    const action = tree.find(n => n.type === 'dialog:AlertDialogAction');
    assert.equal(action.props.disabled, status === 'RETURNED');
    action.props.onClick();
    assert.equal(calls, status === 'RETURNED' ? 0 : 1);
  }
});

test('signup blocks invalid password lengths and accepts a seven-digit employee ID', async () => {
  for (const length of [7, 8, 20, 21]) {
    const values = ['2025129', '테스트교수', 'p'.repeat(length), 'test@example.com', false];
    let index = 0;
    const calls = [];
    const messages = [];
    const notify = Object.assign(message => messages.push(message), { success() {}, error: message => messages.push(message) });
    const Page = load('src/pages/admin/user/Signup.tsx', {
      react: { useState: () => [values[index++], () => {}] },
      'react/jsx-runtime': { jsx, jsxs: jsx },
      'react-router-dom': { useNavigate: () => () => {} },
      '../../../components/ui/card': { Card: 'Card', CardContent: 'CardContent', CardFooter: 'CardFooter' },
      '../../../components/ui/input': { Input: 'Input' }, '../../../components/ui/label': { Label: 'Label' },
      '../../../assets/cse-logo.png': { default: '' }, 'lucide-react': { Eye: 'Eye', EyeOff: 'EyeOff' },
      sonner: { toast: notify },
      '../../../api/auth.api': { useSignUp: () => ({ isPending: false, mutateAsync: async data => { calls.push(data); return {}; } }) },
    }).default;
    const form = nodes(Page()).find(n => n.type === 'form');
    await form.props.onSubmit({ preventDefault() {} });
    if (length === 8 || length === 20) {
      assert.equal(calls.length, 1);
      assert.equal(calls[0].studentId, '2025129');
    } else {
      assert.equal(calls.length, 0);
      assert.ok(messages.some(message => message.includes('8~20')));
    }
  }
});
