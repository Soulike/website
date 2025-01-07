import {Button, type ButtonProps, Input, type InputProps} from 'antd';

import styles from './styles.module.css';

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
    <div className={styles.Add}>
      <Input
        size={'large'}
        disabled={isSubmitting}
        className={styles.categoryInput}
        placeholder={'New category'}
        value={categoryName}
        onChange={onCategoryNameInputChange}
      />
      <Button
        loading={isSubmitting}
        disabled={isSubmitting}
        type={'primary'}
        className={styles.submitButton}
        onClick={onSubmitButtonClick}
      >
        Submit
      </Button>
    </div>
  );
}
