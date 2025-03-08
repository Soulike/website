import {type Category} from '@website/classes';
import {
  Button,
  type ButtonProps,
  Checkbox,
  type CheckboxProps,
  Input,
  type InputProps,
  type ModalProps,
  Select,
  type SelectProps,
  Space,
} from 'antd';
import type {TextAreaProps} from 'antd/lib/input';

import {ArticlePreviewModal} from '@/components/ArticlePreviewModal';

import styles from './styles.module.css';

const {TextArea} = Input;
const {Option} = Select;

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
  isLoadingArticle: boolean;
  isSubmittingArticle: boolean;
  onArticlePreviewButtonClick: ButtonProps['onClick'];
  isArticlePreviewModalOpen: boolean;
  onArticlePreviewModalOk: ModalProps['onOk'];
}

export function ArticleEditor(props: Props) {
  const {
    title,
    content,
    selectedCategory,
    isVisible,
    categoryOption,
    onTitleInputChange,
    onContentTextAreaChange,
    onCategorySelectorChange,
    onIsVisibleCheckboxChange,
    onSubmitButtonClick,
    isLoadingCategory,
    isSubmittingArticle,
    isLoadingArticle,
    onArticlePreviewButtonClick,
    isArticlePreviewModalOpen,
    onArticlePreviewModalOk,
  } = props;
  return (
    <div className={styles.ArticleEditor}>
      <Space.Compact
        direction={'vertical'}
        size={'large'}
        className={styles.inputGroup}
      >
        <Input
          disabled={
            isLoadingCategory || isSubmittingArticle || isLoadingArticle
          }
          value={title}
          onChange={onTitleInputChange}
          className={styles.title}
          placeholder={'Title'}
        />
        <TextArea
          disabled={
            isLoadingCategory || isSubmittingArticle || isLoadingArticle
          }
          value={content}
          onChange={onContentTextAreaChange}
          className={styles.content}
          placeholder={'Content (Markdown)'}
        />
      </Space.Compact>
      <div className={styles.bottomWrapper}>
        <Select
          size={'large'}
          onChange={onCategorySelectorChange}
          value={selectedCategory}
          loading={isLoadingCategory}
          className={styles.categorySelect}
          disabled={isLoadingCategory}
          placeholder={'Category'}
        >
          {categoryOption.map((category) => {
            const {id, name} = category;
            return (
              <Option value={id} key={id}>
                {name}
              </Option>
            );
          })}
        </Select>
        <Checkbox
          disabled={
            isSubmittingArticle || isLoadingCategory || isLoadingArticle
          }
          checked={isVisible}
          onChange={onIsVisibleCheckboxChange}
        >
          Is Public
        </Checkbox>
        <Space.Compact>
          <Button size={'large'} onClick={onArticlePreviewButtonClick}>
            Preview
          </Button>
          <Button
            loading={isSubmittingArticle}
            type={'primary'}
            size={'large'}
            disabled={
              isSubmittingArticle || isLoadingCategory || isLoadingArticle
            }
            onClick={onSubmitButtonClick}
          >
            Submit
          </Button>
        </Space.Compact>
      </div>
      <ArticlePreviewModal
        title={title}
        contentMarkdown={content}
        shown={isArticlePreviewModalOpen}
        onOkButtonClick={onArticlePreviewModalOk}
      />
    </div>
  );
}
