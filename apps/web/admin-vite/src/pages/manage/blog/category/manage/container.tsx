import {useTextInput} from '@library/hooks';
import {CategoryDraftSchema} from '@schema/blog';
import {
  type ButtonProps,
  message,
  type ModalProps,
  notification,
  type PaginationProps,
  type PopconfirmProps,
  type TagProps,
} from 'antd';
import assert from 'assert';
import {useCallback, useEffect, useState} from 'react';

import {
  getServerErrorMessage,
  showErrorNotification,
} from '@/helpers/error-notification-helper.js';
import {
  CATEGORY_DRAFT_FIELD_LABELS,
  validateFormSchema,
} from '@/helpers/validation-i18n-helper.js';

import {ManageView} from './view.js';
import {useViewModel} from './view-model.js';

const DEFAULT_PAGE_SIZE = 10;

// TODO: Revamp this component.
export function Manage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

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
    refreshCategoryArticleAmount,
    handleCategoryModificationSubmit,
    categoryModificationSubmitting,
    handleCategoryDeletion,
    categoryDeletionSubmitting,
  } = useViewModel();

  useEffect(() => {
    if (idToCategoryLoadError) {
      showErrorNotification(idToCategoryLoadError);
    }

    if (idToArticleAmountLoadError) {
      showErrorNotification(idToArticleAmountLoadError);
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

  const onArticleListModalCancel: ModalProps['onCancel'] = (e) => {
    e.preventDefault();
    setIsArticleListModalVisible(false);
  };

  const onModifyModalOk: ModalProps['onOk'] = (e) => {
    e.preventDefault();
    const draft = validateFormSchema(
      CategoryDraftSchema,
      {name: nameOfCategoryToModify},
      CATEGORY_DRAFT_FIELD_LABELS,
      (warningMessage) => {
        void message.warning(warningMessage);
      },
    );
    if (draft === null) {
      return;
    }

    handleCategoryModificationSubmit(
      idOfCategoryToModify,
      draft,
      () => {
        notification.success({title: 'Category modified'});
      },
      (e) => {
        showErrorNotification(e);
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
    handleCategoryDeletion(
      idOfCategoryToDelete,
      (articleAmount) => {
        getServerErrorMessage({
          code: 'CATEGORY_IN_USE',
          details: {articleAmount},
        })
          .then((warningMessage) => {
            void message.warning(warningMessage);
          })
          .catch((error: unknown) => {
            console.error(error);
          });
      },
      (e) => {
        showErrorNotification(e);
      },
    );
  };

  const onArticleDeletedInModal = useCallback(() => {
    refreshCategoryArticleAmount(categoryIdOfArticleListModal);
  }, [categoryIdOfArticleListModal, refreshCategoryArticleAmount]);

  const onPaginationChange: NonNullable<PaginationProps['onChange']> =
    useCallback((page, nextPageSize) => {
      setCurrentPage(page);
      setPageSize(nextPageSize);
    }, []);

  const totalCategories = idToCategory?.size ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCategories / pageSize));
  const effectiveCurrentPage = Math.min(currentPage, totalPages);

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
      currentPage={effectiveCurrentPage}
      pageSize={pageSize}
      onPaginationChange={onPaginationChange}
      isArticleListModalVisible={isArticleListModalVisible}
      categoryIdOfArticleListModal={categoryIdOfArticleListModal}
      onArticleAmountTagClick={onArticleAmountTagClick}
      onArticleListModalOk={onArticleListModalOk}
      onArticleListModalCancel={onArticleListModalCancel}
      onDeleteCategoryButtonClick={onDeleteCategoryButtonClick}
      onDeleteCategoryConfirm={onDeleteCategoryConfirm}
      onArticleDeletedInModal={onArticleDeletedInModal}
      isModifyModalVisible={isModifyModalVisible}
      onModifyModalOk={onModifyModalOk}
      onModifyModalCancel={onModifyModalCancel}
      onModifyButtonClick={onModifyButtonClick}
      onCategoryNameInputChange={onCategoryNameInputChange}
      nameOfCategoryToModify={nameOfCategoryToModify}
    />
  );
}
