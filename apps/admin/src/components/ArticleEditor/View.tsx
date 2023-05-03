import {type Category} from '@website/classes';
import {Button, type ButtonProps, Checkbox, Input, Select} from 'antd';
import {type CheckboxProps} from 'antd/lib/checkbox';
import {type InputProps, type TextAreaProps} from 'antd/lib/input';
import {type ModalProps} from 'antd/lib/modal';
import {type SelectProps} from 'antd/lib/select';

import {ArticlePreviewModal} from '@/components/ArticlePreviewModal';

import Style from './Style.module.scss';

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
    contentMarkdown: string;
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
        contentMarkdown,
    } = props;
    return (
        <div className={Style.ArticleEditor}>
            <Group size={'large'} className={Style.inputGroup}>
                <Input
                    disabled={
                        isLoadingCategory ||
                        isSubmittingArticle ||
                        isLoadingArticle
                    }
                    value={title}
                    onChange={onTitleInputChange}
                    className={Style.title}
                    placeholder={'文章标题'}
                />
                <TextArea
                    disabled={
                        isLoadingCategory ||
                        isSubmittingArticle ||
                        isLoadingArticle
                    }
                    value={content}
                    onChange={onContentTextAreaChange}
                    className={Style.content}
                    placeholder={'文章内容（Markdown）'}
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
                    placeholder={'文章分类'}
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
                        isSubmittingArticle ||
                        isLoadingCategory ||
                        isLoadingArticle
                    }
                    checked={isVisible}
                    onChange={onIsVisibleCheckboxChange}
                >
                    公开文章
                </Checkbox>
                <Button.Group>
                    <Button
                        size={'large'}
                        onClick={onArticlePreviewButtonClick}
                    >
                        预览
                    </Button>
                    <Button
                        loading={isSubmittingArticle}
                        type={'primary'}
                        size={'large'}
                        disabled={
                            isSubmittingArticle ||
                            isLoadingCategory ||
                            isLoadingArticle
                        }
                        onClick={onSubmitButtonClick}
                    >
                        提交
                    </Button>
                </Button.Group>
            </div>
            <ArticlePreviewModal
                title={title}
                contentMarkdown={contentMarkdown}
                open={isArticlePreviewModalOpen}
                onOk={onArticlePreviewModalOk}
                onCancel={onArticlePreviewModalCancel}
            />
        </div>
    );
}
