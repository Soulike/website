import {Button, Input} from 'antd';
import {type ButtonProps} from 'antd';
import {type InputProps} from 'antd';

import Style from './Style.module.scss';

interface Props {
    categoryName: string;
    onCategoryNameInputChange: InputProps['onChange'];
    onSubmitButtonClick: ButtonProps['onClick'];
    isSubmitting: boolean;
}

export function AddView(props: Props) {
    const {
        categoryName,
        onCategoryNameInputChange,
        onSubmitButtonClick,
        isSubmitting,
    } = props;
    return (
        <div className={Style.Add}>
            <Input
                size={'large'}
                disabled={isSubmitting}
                className={Style.categoryInput}
                placeholder={'新分类名'}
                value={categoryName}
                onChange={onCategoryNameInputChange}
            />
            <Button
                loading={isSubmitting}
                disabled={isSubmitting}
                type={'primary'}
                className={Style.submitButton}
                onClick={onSubmitButtonClick}
            >
                提交
            </Button>
        </div>
    );
}
