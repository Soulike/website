import {useTextInput} from '@website/hooks';
import {ModelAccessDeniedError} from '@website/model';
import {
  type ButtonProps,
  message,
  type ModalProps,
  notification,
  type PopconfirmProps,
  type TagProps,
} from 'antd';
import assert from 'assert';
import {useCallback, useEffect, useState} from 'react';

import {showNetworkError} from '@/helpers/error-notification-helper.js';

import {ManageView} from './view.js';
import {useViewModel} from './view-model.js';

// TODO: Revamp this component.
export function Manage() {
  const [isArticleListModalVisible, setIsArticleListModalVisible] =
    useState(false);
  const [categoryIdOfArticleListModal, setCategoryIdOfArticleListModal] =
    useState(0);

  const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
  const [idOfCategoryToModify, setIdOfCategoryToModify] = useState(0);

  const {
    value: nameOfCategoryToModify,
    setValue: setNameOfCategoryToModify,
    onChange: onCategoryNameInputChange,
  } = useTextInput();

  const [idOfCategoryToDelete, setIdOfCategoryToDelete] = useState(0);

  const {
    idToCategory,
    idToCategoryLoadError,
    idToCategoryLoading,
    idToArticleAmountLoading,
    idToArticleAmountLoadError,
    idToArticleAmount,
    handleCategoryModificationSubmit,
    categoryModificationSubmitting,
    handleCategoryDeletion,
    categoryDeletionSubmitting,
  } = useViewModel();

  useEffect(() => {
    if (idToCategoryLoadError) {
      if (idToCategoryLoadError instanceof ModelAccessDeniedError) {
        notification.error({message: idToCategoryLoadError.message});
      } else {
        showNetworkError(idToCategoryLoadError);
      }
    }

    if (idToArticleAmountLoadError) {
      if (idToArticleAmountLoadError instanceof ModelAccessDeniedError) {
        notification.error({message: idToArticleAmountLoadError.message});
      } else {
        showNetworkError(idToArticleAmountLoadError);
      }
    }
  }, [idToCategoryLoadError, idToArticleAmountLoadError]);

  const onArticleAmountTagClick: (id: number) => TagProps['onClick'] = (
    id: number,
  ) => {
    return (e) => {
      e.preventDefault();
      setCategoryIdOfArticleListModal(id);
      setIsArticleListModalVisible(true);
    };
  };

  const onArticleListModalOk: ModalProps['onOk'] = (e) => {
    e.preventDefault();
    setIsArticleListModalVisible(false);
  };

  const onModifyModalOk: ModalProps['onOk'] = (e) => {
    e.preventDefault();
    if (nameOfCategoryToModify.length === 0) {
      void message.warning('Please input category name.');
      return;
    }

    handleCategoryModificationSubmit(
      idOfCategoryToModify,
      {name: nameOfCategoryToModify},
      () => {
        notification.success({message: 'Category modified'});
      },
      (e) => {
        if (e instanceof ModelAccessDeniedError) {
          notification.error({message: e.message});
        } else {
          showNetworkError(e);
        }
      },
    );
  };

  const onModifyModalCancel: ModalProps['onCancel'] = (e) => {
    e.preventDefault();
    setIsModifyModalVisible(false);
  };

  const onModifyButtonClick: (id: number) => ButtonProps['onClick'] =
    useCallback(
      (id) => {
        assert(idToCategory);
        const modifiedCategory = idToCategory.get(id);
        assert.ok(modifiedCategory !== undefined);
        return () => {
          setIdOfCategoryToModify(id);
          setNameOfCategoryToModify(modifiedCategory.name);
          setIsModifyModalVisible(true);
        };
      },
      [idToCategory, setNameOfCategoryToModify],
    );

  const onDeleteCategoryButtonClick: (id: number) => ButtonProps['onClick'] = (
    id,
  ) => {
    return () => {
      setIdOfCategoryToDelete(id);
    };
  };

  const onDeleteCategoryConfirm: PopconfirmProps['onConfirm'] = () => {
    assert(idToArticleAmount);
    if (idToArticleAmount.get(idOfCategoryToDelete) === 0) {
      void message.warning('Can not delete category with articles');
      return;
    }

    handleCategoryDeletion(idOfCategoryToDelete, (e) => {
      if (e instanceof ModelAccessDeniedError) {
        notification.error({message: e.message});
      } else {
        showNetworkError(e);
      }
    });
  };

  return (
    <ManageView
      loading={
        idToCategoryLoading ||
        categoryModificationSubmitting ||
        categoryDeletionSubmitting ||
        idToArticleAmountLoading
      }
      idToCategory={idToCategory}
      categoryToArticleNumberMap={idToArticleAmount}
      isArticleListModalVisible={isArticleListModalVisible}
      categoryIdOfArticleListModal={categoryIdOfArticleListModal}
      onArticleAmountTagClick={onArticleAmountTagClick}
      onArticleListModalOk={onArticleListModalOk}
      onArticleListModalCancel={onArticleListModalOk}
      onDeleteCategoryButtonClick={onDeleteCategoryButtonClick}
      onDeleteCategoryConfirm={onDeleteCategoryConfirm}
      isModifyModalVisible={isModifyModalVisible}
      onModifyModalOk={onModifyModalOk}
      onModifyModalCancel={onModifyModalCancel}
      onModifyButtonClick={onModifyButtonClick}
      onCategoryNameInputChange={onCategoryNameInputChange}
      nameOfCategoryToModify={nameOfCategoryToModify}
    />
  );
}
