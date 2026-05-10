// ============================================
// СЕРВИС — ШАБЛОН
//
// ЧТО ТАКОЕ СЕРВИС?
// Сервис — это файл с функциями которые делают
// HTTP запросы на бэкенд. Каждая функция = один эндпоинт.
// Стор вызывает сервис, сервис делает запрос, возвращает данные.

// КАК ИСПОЛЬЗОВАТЬ?
// 1. Скопируй этот файл
// 2. Переименуй: habitService.ts, productService.ts и тд
// 3. Замени "entities" в URL на свой эндпоинт (/habits, /products и тд)
// 4. Замени типы импортов на свои
//
// ВАЖНО:
// nextApi — делает запрос через Next.js сервер (куки передаются)
// globalApi — делает запрос напрямую на бэкенд (без кук)
// Используй nextApi если нужна авторизация!
// ============================================

// МЕНЯЙ ЭТИ ИМПОРТЫ НА СВОИ
import { CreateEntity, UpdateEntity } from '@/types/entity';

// nextApi — axios инстанс с baseURL: '/api'
// Все запросы идут через Next.js роуты (/api/...)
// благодаря этому куки авторизации передаются на бэкенд
import { nextApi } from './serverConfig';

// ============================================
// GET ALL — получить все объекты
// Вызывается в сторе в fetchEntities()
// Соответствует роуту: GET /api/entities → GET /entities на бэке
// ============================================
export async function getEntities() {
  const result = await nextApi.get('/entities');
  // '/entities' — меняй на свой эндпоинт: '/habits', '/products' и тд

  return result.data;
  // result.data — это массив объектов который вернул бэк
  // например: [{_id: '1', title: 'test'}, ...]
}

// ============================================
// CREATE — создать новый объект
// Вызывается в сторе в createEntity()
// Соответствует роуту: POST /api/entities → POST /entities на бэке
// ============================================
export async function createEntityService(body: CreateEntity) {
  // body — данные из формы (title, amount и тд)
  // CreateEntity — тип без _id, только то что вводит юзер

  const result = await nextApi.post('/entities', body);
  // второй аргумент — данные которые отправляем на бэк

  return result.data;
  // возвращает созданный объект уже с _id от MongoDB
}

// ============================================
// UPDATE — обновить существующий объект
// Вызывается в сторе в updateEntity()
// Соответствует роуту: PATCH /api/entities/:id → PATCH /entities/:id на бэке
// ============================================
export async function updateEntityService(id: string, body: UpdateEntity) {
  // id — _id объекта который обновляем
  // body — только те поля которые меняем (все опциональные)

  const result = await nextApi.patch(`/entities/${id}`, body);
  // `/entities/${id}` — динамический URL с id объекта

  return result.data;
  // возвращает обновлённый объект
}

// ============================================
// DELETE — удалить объект
// Вызывается в сторе в deleteEntity()
// Соответствует роуту: DELETE /api/entities/:id → DELETE /entities/:id на бэке
// ============================================
export async function deleteEntityService(id: string) {
  // id — _id объекта который удаляем

  const result = await nextApi.delete(`/entities/${id}`);
  // ничего не отправляем в body — просто указываем id в URL

  return result.data;
  // возвращает удалённый объект или { success: true }
}
