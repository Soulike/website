import {type Category} from '@website/classes';
import {type ButtonProps} from 'antd';
import {type CheckboxProps} from 'antd';
import {type InputProps} from 'antd';
import {type ModalProps} from 'antd';
import {type SelectProps} from 'antd';
import {TextAreaProps} from 'antd/lib/input';

import {ArticleEditor} from '@/components/ArticleEditor';

import Style from './Style.module.scss';

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
    isSubmittingArticle: boolean;
    isLoadingArticle: boolean;
    onArticlePreviewButtonClick: ButtonProps['onClick'];
    isArticlePreviewModalOpen: boolean;
    onArticlePreviewModalOk: ModalProps['onOk'];
    onArticlePreviewModalCancel: ModalProps['onCancel'];
}

export function ModifyView(props: Props) {
    return (
        <div className={Style.Modify}>
            <ArticleEditor {...props} />
        </div>
    );
}
