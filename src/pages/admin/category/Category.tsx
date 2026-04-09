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
import { Label } from "../../../components/ui/label";
import { toast } from "sonner";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../../../api/adminCategory.api";
import type { CategoryItem } from "../../../type/adminCategory.type";

const Category = () => {
  const { data: categories = [], isLoading, isError } = useCategories();
  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateCategory();
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } =
    useUpdateCategory();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryDescription, setEditCategoryDescription] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const selectedCategories = categories.filter((category: CategoryItem) =>
    selectedCategoryIds.includes(category.category_id),
  );

  const selectedCategory = selectedCategories[0] ?? null;

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

  const handleOpenEditDialog = () => {
    if (selectedCategoryIds.length === 0) {
      toast.error("수정할 카테고리를 선택해주세요.");
      return;
    }

    if (selectedCategoryIds.length > 1) {
      toast.error("수정은 한 번에 하나의 카테고리만 가능합니다.");
      return;
    }

    if (!selectedCategory) {
      toast.error("선택한 카테고리 정보를 찾을 수 없습니다.");
      return;
    }

    setEditCategoryId(selectedCategory.category_id);
    setEditCategoryName(selectedCategory.name);
    setEditCategoryDescription(selectedCategory.description);
    setEditDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (editCategoryId === null) {
      toast.error("수정할 카테고리 정보가 없습니다.");
      return;
    }

    if (!editCategoryName.trim()) {
      toast.error("카테고리명을 입력해주세요.");
      return;
    }

    if (!editCategoryDescription.trim()) {
      toast.error("설명을 입력해주세요.");
      return;
    }

    try {
      await updateCategory({
        category_id: editCategoryId,
        name: editCategoryName.trim(),
        description: editCategoryDescription.trim(),
      });

      toast.success("카테고리가 수정되었습니다.");
      setEditDialogOpen(false);
      setEditCategoryId(null);
      setEditCategoryName("");
      setEditCategoryDescription("");
      setSelectedCategoryIds([]);
    } catch (error) {
      console.error(error);
      toast.error("카테고리 수정에 실패했습니다.");
    }
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
      <div className="pt-14">
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
          {/* todo : 카테고리 수정 버튼 */}
          <div>
            <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <AlertDialogTrigger asChild>
                <div
                  className="hover:bg-neutral-800 cursor-pointer border border-neutral-400 text-neutral-200 text-sm px-3 py-1 rounded-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenEditDialog();
                  }}
                >
                  수정
                </div>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>카테고리 수정</AlertDialogTitle>
                  <AlertDialogDescription>
                    선택한 카테고리 정보를 수정해보세요.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 pt-6">
                  <div>
                    <Label className="pb-2">카테고리 ID</Label>
                    <Input value={editCategoryId ?? ""} readOnly />
                  </div>

                  <div>
                    <Label className="pb-2">카테고리명</Label>
                    <Input
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      placeholder="카테고리명을 입력하세요"
                    />
                  </div>

                  <div>
                    <Label className="pb-2">설명</Label>
                    <Input
                      value={editCategoryDescription}
                      onChange={(e) =>
                        setEditCategoryDescription(e.target.value)
                      }
                      placeholder="카테고리 설명을 입력하세요"
                    />
                  </div>
                </div>

                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel
                    className="cursor-pointer"
                    disabled={isUpdating}
                  >
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpdateCategory();
                    }}
                    disabled={isUpdating}
                    className="hover:bg-neutral-700 font-bold cursor-pointer"
                  >
                    {isUpdating ? "수정 중..." : "수정"}
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
                    <TableCell className="text-left">
                      {category.description}
                    </TableCell>
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
