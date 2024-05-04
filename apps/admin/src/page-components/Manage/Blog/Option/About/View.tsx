import {Button, Input} from 'antd';
import {type ButtonProps} from 'antd';
import {type ModalProps} from 'antd';
import {type TextAreaProps} from 'antd/lib/input';

import {ArticlePreviewModal} from '@/components/ArticlePreviewModal';

import Style from './Style.module.scss';

const {TextArea} = Input;

interface Props {
    aboutMarkdown: string;
    onAboutTextareaChange: TextAreaProps['onChange'];
    onPreviewButtonClick: ButtonProps['onClick'];
    onSubmitButtonClick: ButtonProps['onClick'];

    onPreviewModalOk: ModalProps['onOk'];
    onPreviewModalCancel: ModalProps['onCancel'];
    previewModalOpen: boolean;
    loading: boolean;
}

export function AboutView(props: Props) {
    const {
        onAboutTextareaChange,
        aboutMarkdown,
        onPreviewModalCancel,
        onPreviewModalOk,
        previewModalOpen,
        onSubmitButtonClick,
        onPreviewButtonClick,
        loading,
    } = props;

    return (
        <div className={Style.About}>
            <TextArea
                className={Style.textarea}
                placeholder={'关于内容（Markdown）'}
                onChange={onAboutTextareaChange}
                value={aboutMarkdown}
                disabled={loading}
            />
            <div className={Style.buttonWrapper}>
                <Button.Group size={'large'}>
                    <Button disabled={loading} onClick={onPreviewButtonClick}>
                        预览
                    </Button>
                    <Button
                        disabled={loading}
                        type={'primary'}
                        onClick={onSubmitButtonClick}
                    >
                        提交
                    </Button>
                </Button.Group>
            </div>
            <ArticlePreviewModal
                title={'关于'}
                contentMarkdown={aboutMarkdown}
                onOk={onPreviewModalOk}
                onCancel={onPreviewModalCancel}
                open={previewModalOpen}
            />
        </div>
    );
}
