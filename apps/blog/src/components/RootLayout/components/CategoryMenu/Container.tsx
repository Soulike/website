import {CategoryMenuView} from './View';
import {CategoryModelViewModel} from './ViewModel';

export interface ICategoryMenuViewProps {
  isMobile: boolean;
}

// TODO: View when error
export async function CategoryMenu({isMobile}: ICategoryMenuViewProps) {
  const categories = await CategoryModelViewModel.getAllCategories();
  return <CategoryMenuView categories={categories} isMobile={isMobile} />;
}
