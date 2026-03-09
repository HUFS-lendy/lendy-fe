import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { Checkbox } from "../../../components/ui/checkbox";
import { DeviceStateCombobox } from "../../../components/ui/DeviceStateCombobox";
import { toast } from "sonner";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  type CategoryItem,
} from "../../../api/adminCategory.api";
import { Label } from "../../../components/ui/label";

const Category = () => {
  const { data: categories = [], isLoading, isError } = useCategories();
  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateCategory();
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory();

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const resetCreateForm = () => {
    setCategoryName("");
    setCategoryDescription("");
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("카테고리명을 입력해주세요.");
      return;
    }

    if (!categoryDescription.trim()) {
      toast.error("설명을 입력해주세요.");
      return;
    }

    try {
      await createCategory({
        name: categoryName.trim(),
        description: categoryDescription.trim(),
      });

      toast.success("카테고리가 추가되었습니다.");
      resetCreateForm();
      setCreateDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("카테고리 추가에 실패했습니다.");
    }
  };

  const toggleCategorySelection = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleDeleteCategories = async () => {
    if (selectedCategoryIds.length === 0) {
      toast.error("삭제할 카테고리를 선택해주세요.");
      return;
    }

    try {
      await Promise.all(
        selectedCategoryIds.map((categoryId) => deleteCategory(categoryId)),
      );

      toast.success("선택한 카테고리가 삭제되었습니다.");
      setSelectedCategoryIds([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("카테고리 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="bg-[#060a0c] w-screen px-8 text-white">
      {/* 브래드크럼 */}
      <div className="pt-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-white hover:text-gray-100"
                href="/admin"
              >
                홈
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-white hover:text-gray-100"
                href="/admin/devices"
              >
                카테고리
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">카테고리 현황</div>

        <div className="flex space-x-4 justify-end">
          {/* 카테고리 추가 버튼 */}
          <div>
            <AlertDialog
              open={createDialogOpen}
              onOpenChange={setCreateDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm">
                  추가
                </div>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>카테고리 추가</AlertDialogTitle>
                  <AlertDialogDescription>
                    새 카테고리를 추가하면 됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 pt-6">
                  <div>
                    <Label className="pb-2">카테고리명</Label>
                    <Input
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="카테고리명을 입력하세요"
                    />
                  </div>

                  <div>
                    <Label className="pb-2">설명</Label>
                    <Input
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                      placeholder="카테고리에 대한 설명을 입력하세요"
                    />
                  </div>
                </div>

                <AlertDialogFooter className="pt-8">
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      void handleCreateCategory();
                    }}
                    disabled={isCreating}
                  >
                    {isCreating ? "추가 중..." : "추가"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {/* 카테고리 수정 버튼 */}
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="hover:bg-neutral-800 cursor-pointer border border-neutral-400 text-neutral-200 text-sm px-3 py-1 rounded-sm">
                  수정
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    2025-1 iPad Air 3 내용 수정
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    기기 대여 내용을 수정해보세요.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div>
                  <Table className="text-center border border-neutral-200">
                    <TableBody>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          대여 ID
                        </TableCell>
                        <TableCell className="text-left px-6">1</TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          분류
                        </TableCell>
                        <TableCell className="text-left px-6">태블릿</TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          기기명
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <Input
                            className="text-sm"
                            readOnly
                            value="iPad Air 3"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          코드번호
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <Input className="text-sm" value="A20342" />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          대여 학기
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <Input
                            className="text-sm"
                            value="2025-1"
                            placeholder="yyyy-1"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          대여 상태
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <DeviceStateCombobox />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel className="cursor-pointer">
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      toast("해당 기기의 대여 상태가 수정되었습니다.")
                    }
                    className=" hover:bg-neutral-700 font-bold cursor-pointer"
                  >
                    수정
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* 카테고리 삭제 버튼 */}
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <div
                className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-red-400 hover:text-black border-red-400 text-sm text-red-300"
                onClick={(e) => {
                  if (selectedCategoryIds.length === 0) {
                    e.preventDefault();
                    toast.error("삭제할 카테고리를 선택해주세요.");
                  }
                }}
              >
                삭제
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  선택한 카테고리를 삭제하시겠습니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  카테고리를 삭제하면 다시 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    void handleDeleteCategories();
                  }}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-500 font-bold"
                >
                  {isDeleting ? "삭제 중..." : "삭제"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="mt-4">
          <Table className="text-white text-center border border-neutral-700">
            <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-white text-center">
                  카테고리 ID
                </TableHead>
                <TableHead className="text-white text-center">
                  카테고리명
                </TableHead>
                <TableHead className="text-white text-center">설명</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    불러오는 중...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-red-300"
                  >
                    카테고리 목록을 불러오지 못했습니다.
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    등록된 카테고리가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category: CategoryItem) => (
                  <TableRow key={category.category_id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCategoryIds.includes(
                          category.category_id,
                        )}
                        onCheckedChange={() =>
                          toggleCategorySelection(category.category_id)
                        }
                      />
                    </TableCell>
                    <TableCell>{category.category_id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Category;
