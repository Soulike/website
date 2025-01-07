import {Category} from '@website/classes';
import {Blog} from '@website/server-api';
import {
  type ButtonProps,
  type InputProps,
  message,
  type ModalProps,
  notification,
  type PopconfirmProps,
  type TagProps,
} from 'antd';
import assert from 'assert';
import {useEffect, useState} from 'react';

import {showNetworkError} from '@/helpers/error-notification-helper.js';
import {useCategories} from '@/hooks/useCategories';

import {ManageView} from './view.js';

export function Manage() {
  const {loading: isLoadingCategories, categories} = useCategories();
  const [isModifyingCategory, setIsModifyingCategory] = useState(false);
  const [
    loadingArticleAmountOfCategories,
    setLoadingArticleAmountOfCategories,
  ] = useState(true);
  const [categoryMap, setCategoryMap] = useState<Map<number, Category>>(
    new Map(),
  );
  const [categoryToArticleNumberMap, setCategoryToArticleNumberMap] = useState<
    Map<number, number>
  >(new Map());

  const [isArticleListModalVisible, setIsArticleListModalVisible] =
    useState(false);
  const [categoryIdOfArticleListModal, setCategoryIdOfArticleListModal] =
    useState(0);

  const [isModifyModalVisible, setIsModifyModalVisible] = useState(false);
  const [idOfCategoryToModify, setIdOfCategoryToModify] = useState(0);
  const [nameOfCategoryToModify, setNameOfCategoryToModify] = useState('');

  const [idOfCategoryToDelete, setIdOfCategoryToDelete] = useState(0);

  useEffect(() => {
    if (categories) {
      const categoryMap = new Map<number, Category>();
      categories.forEach((category) => {
        categoryMap.set(category.id, category);
      });
      setCategoryMap(categoryMap);
    }
  }, [categories]);

  useEffect(() => {
    setLoadingArticleAmountOfCategories(true);
    void Blog.Category.getAllArticleAmountById()
      .then((response) => {
        if (response.isSuccessful) {
          const {data: categoryIdToArticleAmountPair} = response;
          const categoryToArticleNumberMap = new Map<number, number>();
          Object.keys(categoryIdToArticleAmountPair).forEach((idString) => {
            const id = Number.parseInt(idString);
            categoryToArticleNumberMap.set(
              id,
              categoryIdToArticleAmountPair[id],
            );
          });
          setCategoryToArticleNumberMap(categoryToArticleNumberMap);
        } else {
          const {message} = response;
          notification.warning({message});
        }
      })
      .catch((e: unknown) => {
        showNetworkError(e);
      })
      .finally(() => {
        setLoadingArticleAmountOfCategories(false);
      });
  }, []);

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
    const executor = async () => {
      if (nameOfCategoryToModify !== '') {
        setIsModifyingCategory(true);
        try {
          const response = await Blog.Category.modify(
            new Category(idOfCategoryToModify, nameOfCategoryToModify),
          );
          if (response.isSuccessful) {
            notification.success({message: '文章分类编辑成功'});
            setCategoryMap((categoryMap) => {
              const modifiedCategory = categoryMap.get(idOfCategoryToModify);
              assert.ok(modifiedCategory !== undefined);
              modifiedCategory.name = nameOfCategoryToModify;
              return new Map(categoryMap);
            });
            setIsModifyModalVisible(false);
          } else {
            const {message} = response;
            notification.warning({message});
          }
        } catch (e) {
          showNetworkError(e);
        } finally {
          setIsModifyingCategory(false);
        }
      } else {
        await message.warning('文章分类名不能为空');
      }
    };
    void executor();
  };

  const onModifyModalCancel: ModalProps['onCancel'] = (e) => {
    e.preventDefault();
    setIsModifyModalVisible(false);
  };

  const onModifyButtonClick: (id: number) => ButtonProps['onClick'] = (id) => {
    const modifiedCategory = categoryMap.get(id);
    assert.ok(modifiedCategory !== undefined);
    return () => {
      setIdOfCategoryToModify(id);
      setNameOfCategoryToModify(modifiedCategory.name);
      setIsModifyModalVisible(true);
    };
  };

  const onCategoryNameInputChange: InputProps['onChange'] = (e) => {
    setNameOfCategoryToModify(e.target.value);
  };

  const onDeleteCategoryButtonClick: (id: number) => ButtonProps['onClick'] = (
    id,
  ) => {
    return () => {
      setIdOfCategoryToDelete(id);
    };
  };

  const onDeleteCategoryConfirm: PopconfirmProps['onConfirm'] = () => {
    const executor = async () => {
      if (categoryToArticleNumberMap.get(idOfCategoryToDelete) !== 0) {
        await message.warning('不能删除有文章的分类');
      } else {
        setIsModifyingCategory(true);
        try {
          const response = await Blog.Category.deleteById(idOfCategoryToDelete);
          if (response.isSuccessful) {
            notification.success({
              message: '删除文章分类成功',
            });

            setCategoryMap((categoryMap) => {
              categoryMap.delete(idOfCategoryToDelete);
              return new Map(categoryMap);
            });
            setCategoryToArticleNumberMap((categoryToArticleNumberMap) => {
              categoryToArticleNumberMap.delete(idOfCategoryToDelete);
              return new Map(categoryToArticleNumberMap);
            });
          } else {
            const {message} = response;
            notification.warning({message});
          }
        } catch (e) {
          showNetworkError(e);
        } finally {
          setIsModifyingCategory(false);
        }
      }
    };

    void executor();
  };

  return (
    <ManageView
      loading={
        isLoadingCategories ||
        isModifyingCategory ||
        loadingArticleAmountOfCategories
      }
      categoryMap={categoryMap}
      categoryToArticleNumberMap={categoryToArticleNumberMap}
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
