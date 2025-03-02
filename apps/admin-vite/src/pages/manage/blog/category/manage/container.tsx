import {useTextInputViewModel} from '@website/hooks';
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
  } = useTextInputViewModel();

  const [idOfCategoryToDelete, setIdOfCategoryToDelete] = useState(0);

  const {
    idToCategory,
    idToCategoryError,
    idToCategoryLoading,
    categoryIdToArticleAmount,
    categoryIdToArticleAmountLoading,
    categoryIdToArticleAmountError,
    modifyCategory,
    modifyCategoryLoading,
    deleteCategoryById,
    deleteCategoryByIdLoading,
  } = useViewModel();

  useEffect(() => {
    if (idToCategoryError) {
      if (idToCategoryError instanceof ModelAccessDeniedError) {
        notification.error({message: idToCategoryError.message});
      } else {
        showNetworkError(idToCategoryError);
      }
    }

    if (categoryIdToArticleAmountError) {
      if (categoryIdToArticleAmountError instanceof ModelAccessDeniedError) {
        notification.error({message: categoryIdToArticleAmountError.message});
      } else {
        showNetworkError(categoryIdToArticleAmountError);
      }
    }
  }, [idToCategoryError, categoryIdToArticleAmountError]);

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

    modifyCategory(
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
    assert(categoryIdToArticleAmount);
    if (categoryIdToArticleAmount.get(idOfCategoryToDelete) === 0) {
      void message.warning('Can not delete category with articles');
      return;
    }

    deleteCategoryById(idOfCategoryToDelete, (e) => {
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
        modifyCategoryLoading ||
        deleteCategoryByIdLoading ||
        categoryIdToArticleAmountLoading
      }
      categoryMap={idToCategory ?? new Map()}
      categoryToArticleNumberMap={categoryIdToArticleAmount ?? new Map()}
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
