import {Article, type Category, NewArticle} from '@website/classes';
import {
  Button,
  type ButtonProps,
  Checkbox,
  type CheckboxProps,
  Input,
  type InputProps,
  Select,
  type SelectProps,
  Space,
} from 'antd';
import type {TextAreaProps} from 'antd/lib/input';
import {useMemo} from 'react';

import styles from './styles.module.css';

const {TextArea} = Input;
const {Option} = Select;

export interface ArticleEditorViewProps {
  title: Article['title'];
  content: Article['content'];
  selectedCategory: Article['category'] | null;
  isVisible: Article['isVisible'];
  categories: Category[] | null;
  onTitleInputChange: InputProps['onChange'];
  onContentTextAreaChange: TextAreaProps['onChange'];
  onCategorySelectorChange: SelectProps<number>['onChange'];
  onIsVisibleCheckboxChange: CheckboxProps['onChange'];
  onSubmitButtonClick: (article: {
    title: NewArticle['title'];
    content: NewArticle['content'];
    category: NewArticle['category'] | null;
    isVisible: NewArticle['isVisible'];
  }) => void;
  onPreviewButtonClick: ButtonProps['onClick'];
  isLoadingCategory: boolean;
  isLoadingArticle: boolean;
  isSubmittingArticle: boolean;
  disabled: boolean;
}

export function ArticleEditorView(props: ArticleEditorViewProps) {
  const {
    title,
    content,
    selectedCategory,
    isVisible,
    categories,
    onTitleInputChange,
    onContentTextAreaChange,
    onCategorySelectorChange,
    onIsVisibleCheckboxChange,
    onSubmitButtonClick,
    onPreviewButtonClick,
    isLoadingCategory,
    isSubmittingArticle,
    isLoadingArticle,
    disabled,
  } = props;

  const shouldDisable = useMemo(
    () =>
      isLoadingCategory || isSubmittingArticle || isLoadingArticle || disabled,
    [disabled, isLoadingArticle, isLoadingCategory, isSubmittingArticle],
  );

  return (
    <div className={styles.ArticleEditor}>
      <Space.Compact
        direction={'vertical'}
        size={'large'}
        className={styles.inputGroup}
      >
        <Input
          disabled={shouldDisable}
          value={title}
          onChange={onTitleInputChange}
          className={styles.title}
          placeholder={'Title'}
        />
        <TextArea
          disabled={shouldDisable}
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
          disabled={shouldDisable || !categories}
          placeholder={'Category'}
        >
          {categories?.map((category) => {
            const {id, name} = category;
            return (
              <Option value={id} key={id}>
                {name}
              </Option>
            );
          })}
        </Select>
        <Checkbox
          disabled={shouldDisable}
          checked={isVisible}
          onChange={onIsVisibleCheckboxChange}
        >
          Is Public
        </Checkbox>
        <Space.Compact>
          <Button
            size={'large'}
            onClick={onPreviewButtonClick}
            disabled={shouldDisable}
          >
            Preview
          </Button>
          <Button
            loading={isSubmittingArticle}
            type={'primary'}
            size={'large'}
            disabled={shouldDisable}
            onClick={() => {
              onSubmitButtonClick({
                title,
                content,
                category: selectedCategory,
                isVisible,
              });
            }}
          >
            Submit
          </Button>
        </Space.Compact>
      </div>
    </div>
  );
}
