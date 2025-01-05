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
} from 'antd';
import type {TextAreaProps} from 'antd/lib/input';

import {ArticlePreviewModal} from '@/components/ArticlePreviewModal';

import Style from './styles.module.css';

const {Group, TextArea} = Input;
const {Option} = Select;

interface Props {
  title: string;
  content: string;
  category: number | undefined;
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
  onArticlePreviewModalCancel: ModalProps['onCancel'];
}

export function ArticleEditor(props: Props) {
  const {
    title,
    content,
    category,
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
    onArticlePreviewModalCancel,
  } = props;
  return (
    <div className={Style.ArticleEditor}>
      <Group size={'large'} className={Style.inputGroup}>
        <Input
          disabled={
            isLoadingCategory || isSubmittingArticle || isLoadingArticle
          }
          value={title}
          onChange={onTitleInputChange}
          className={Style.title}
          placeholder={'Title'}
        />
        <TextArea
          disabled={
            isLoadingCategory || isSubmittingArticle || isLoadingArticle
          }
          value={content}
          onChange={onContentTextAreaChange}
          className={Style.content}
          placeholder={'Content（Markdown）'}
        />
      </Group>
      <div className={Style.bottomWrapper}>
        <Select
          size={'large'}
          onChange={onCategorySelectorChange}
          value={category}
          loading={isLoadingCategory}
          className={Style.categorySelect}
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
        <Button.Group>
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
        </Button.Group>
      </div>
      <ArticlePreviewModal
        title={title}
        contentMarkdown={content}
        open={isArticlePreviewModalOpen}
        onOk={onArticlePreviewModalOk}
        onCancel={onArticlePreviewModalCancel}
      />
    </div>
  );
}
