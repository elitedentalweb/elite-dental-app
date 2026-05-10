// ============================================
// СТОР — ШАБЛОН (Zustand)
// КАК ДОСТАТЬ ДАННЫЕ В КОМПОНЕНТЕ?
// const { entities, fetchEntities } = useEntityStore()
// ============================================

import { create } from 'zustand';

// МЕНЯЙ ЭТИ ИМПОРТЫ НА СВОИ
// Entity — основной тип объекта (приходит с бэка)
// CreateEntity — тип для создания (без _id)
// UpdateEntity — тип для обновления (все поля опциональные)
import { Entity, CreateEntity, UpdateEntity } from '@/types/entity';

// Сервисы — функции которые делают запросы на бэкенд
// Каждая функция = один эндпоинт
import {
  getEntities, // GET /entities
  createEntityService, // POST /entities
  updateEntityService, // PATCH /entities/:id
  deleteEntityService, // DELETE /entities/:id
} from '@/services/entity';

// ============================================
// ТИП СТОРА
// Описываем что будет храниться и какие функции будут
// ============================================
type EntityStore = {
  // ---- ДАННЫЕ ----
  entities: Entity[];
  // Массив всех объектов которые пришли с бэка
  // Например: [{_id: '1', title: 'Habit 1'}, {_id: '2', title: 'Habit 2'}]

  isLoading: boolean;
  // true — когда идёт запрос на бэкенд
  // false — когда запрос завершился (успешно или нет)
  // Используется чтобы показать лоадер в компоненте:
  // if (isLoading) return <div>Loading...</div>

  // ---- ФУНКЦИИ ----
  // () => Promise<void> означает что функция асинхронная и ничего не возвращает

  fetchEntities: () => Promise<void>;
  // Загружает все объекты с бэка и кладёт в entities[]
  // Вызывай в useEffect при загрузке страницы

  createEntity: (entity: CreateEntity) => Promise<void>;
  // Создаёт новый объект на бэке
  // Принимает данные формы (без _id)
  // После создания добавляет новый объект в начало массива entities[]

  updateEntity: (id: string, entity: UpdateEntity) => Promise<void>;
  // Обновляет существующий объект на бэке
  // id — какой объект обновить
  // entity — что именно меняем (только изменённые поля)
  // После обновления заменяет старый объект новым в массиве entities[]

  deleteEntity: (id: string) => Promise<void>;
  // Удаляет объект на бэке
  // id — какой объект удалить
  // После удаления убирает объект из массива entities[]
};

// ============================================
// РЕАЛИЗАЦИЯ СТОРА
// create<EntityStore> — создаём стор с нашим типом
// (set, get) — две функции:
//   set — обновить данные в сторе
//   get — получить текущие данные из стора
// ============================================
export const useEntityStore = create<EntityStore>((set, get) => ({
  // ---- НАЧАЛЬНЫЕ ЗНАЧЕНИЯ ----
  // Это то что будет в сторе до первого запроса
  entities: [], // пустой массив — данных ещё нет
  isLoading: false, // false — запрос ещё не начался

  // ============================================
  // GET ALL — получить все объекты с бэка
  // Вызывай так: fetchEntities()
  // В компоненте: useEffect(() => { fetchEntities() }, [])
  // ============================================
  fetchEntities: async () => {
    set({ isLoading: true }); // показываем лоадер
    try {
      const data = await getEntities();
      // getEntities() делает GET запрос на /api/entities
      // data — массив объектов который пришёл с бэка

      set({ entities: data });
      // кладём полученные данные в стор
      // теперь в любом компоненте entities будет этот массив
    } catch (error) {
      console.log(error); // если что-то пошло не так
    } finally {
      set({ isLoading: false }); // убираем лоадер в любом случае
    }
  },

  // ============================================
  // CREATE — создать новый объект
  // Вызывай так: createEntity({ title: 'test', amount: 100 })
  // ============================================
  createEntity: async (entity) => {
    // entity — данные из формы которые передал компонент
    set({ isLoading: true });
    try {
      const newEntity = await createEntityService(entity);
      // createEntityService() делает POST запрос на /api/entities
      // newEntity — созданный объект который вернул бэк (уже с _id)

      const updated = [newEntity, ...get().entities];
      // get().entities — текущий массив в сторе
      // [newEntity, ...get().entities] — добавляем новый объект В НАЧАЛО массива
      // Так новый объект появится первым в списке

      set({ entities: updated }); // обновляем стор
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ============================================
  // UPDATE — обновить существующий объект
  // Вызывай так: updateEntity('объект_id', { title: 'новый title' })
  // ============================================
  updateEntity: async (id, entity) => {
    // id — какой объект обновляем
    // entity — что именно меняем
    set({ isLoading: true });
    try {
      const updatedEntity = await updateEntityService(id, entity);
      // updateEntityService() делает PATCH запрос на /api/entities/:id
      // updatedEntity — обновлённый объект который вернул бэк

      const updated = get().entities.map(
        (el) => (el._id === id ? updatedEntity : el)
        // map проходит по всем объектам в массиве
        // если _id совпадает — заменяем на обновлённый объект
        // если не совпадает — оставляем как есть
      );

      set({ entities: updated });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  // ============================================
  // DELETE — удалить объект
  // Вызывай так: deleteEntity('объект_id')
  // ============================================
  deleteEntity: async (id) => {
    // id — какой объект удаляем
    set({ isLoading: true });
    try {
      await deleteEntityService(id);
      // deleteEntityService() делает DELETE запрос на /api/entities/:id
      // ничего не возвращает — просто удаляет на бэке

      const updated = get().entities.filter((el) => el._id !== id);
      // filter оставляет только те объекты у которых _id НЕ совпадает с удалённым
      // то есть просто убирает удалённый объект из массива

      set({ entities: updated });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
