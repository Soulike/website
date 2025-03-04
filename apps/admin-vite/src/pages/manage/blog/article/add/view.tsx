import {type Category} from '@website/classes';
import {
  type ButtonProps,
  type CheckboxProps,
  type InputProps,
  type ModalProps,
  type SelectProps,
} from 'antd';
import {TextAreaProps} from 'antd/lib/input';

import {ArticleEditor} from '@/components/ArticleEditor';

import styles from './styles.module.css';

interface Props {
  title: string;
  content: string;
  selectedCategory: number | null;
  isVisible: boolean;
  categoryOption: Category[];
  onTitleInputChange: InputProps['onChange'];
  onContentTextAreaChange: TextAreaProps['onChange'];
  onCategorySelectorChange: SelectProps<number>['onChange'];
  onIsVisibleCheckboxChange: CheckboxProps['onChange'];
  onSubmitButtonClick: ButtonProps['onClick'];
  isLoadingCategory: boolean;
  isSubmittingArticle: boolean;
  onArticlePreviewButtonClick: ButtonProps['onClick'];
  isArticlePreviewModalOpen: boolean;
  onArticlePreviewModalOk: ModalProps['onOk'];
  onArticlePreviewModalCancel: ModalProps['onCancel'];
}

export function AddView(props: Props) {
  return (
    <div className={styles.Add}>
      <ArticleEditor {...props} isLoadingArticle={false} />
    </div>
  );
}
