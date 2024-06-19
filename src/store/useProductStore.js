import { wait } from '@/utils/helpers';
import { defineStore } from 'pinia';

const FETCH_ATTEMPTS_COUNT = 3;
const FETCH_DELAY_REQUEST_MS = 3000;
const BASE_URL = 'https://fakestoreapi.com/products';
const FETCH_ERROR_MESSAGE = "Что-то пошло не так. Попробую загрузить данные снова через";
const SERVER_ERROR_MESSAGE = 'Извините. Сервер временно недоступен. Пожалуйста, попробуйте позже';

// Функция для изменения описания, названия и категорий продуктов
const adaptProductData = (product, index) => {
  const carNames = [
    'BMW X5',
    'Audi Q7',
    'Mercedes-Benz GLC',
    'Lexus RX',
    'Tesla Model X',
    'Porsche Cayenne',
    'Volvo XC90',
    'Range Rover Evoque',
    'Jaguar F-Pace',
    'Ford Mustang'
  ];

  const carDescriptions = [
    'Пробег: 20,000 км. Полный привод, кожаный салон, навигационная система.',
    'Пробег: 35,000 км. Бензиновый двигатель, панорамная крыша, климат-контроль.',
    'Пробег: 15,000 км. Дизельный двигатель, автоматическая трансмиссия, подогрев сидений.',
    'Пробег: 25,000 км. Гибридный двигатель, система помощи при парковке, круиз-контроль.',
    'Пробег: 10,000 км. Электрический двигатель, автопилот, премиум аудиосистема.',
    'Пробег: 5,000 км. Бензиновый двигатель, кожаный салон, спортивный режим.',
    'Пробег: 30,000 км. Дизельный двигатель, автоматическая трансмиссия, подогрев сидений.',
    'Пробег: 18,000 км. Гибридный двигатель, система помощи при парковке, круиз-контроль.',
    'Пробег: 12,000 км. Бензиновый двигатель, кожаный салон, система помощи при парковке.',
    'Пробег: 8,000 км. Бензиновый двигатель, спортивный режим, круиз-контроль.'
  ];

  const carCategories = [
    'Внедорожники',
    'Внедорожники',
    'Внедорожники',
    'Внедорожники',
    'Электромобили',
    'Внедорожники',
    'Внедорожники',
    'Внедорожники',
    'Внедорожники',
    'Купе'
  ];

  const carPrices = [
    5000000, // BMW X5
    6000000, // Audi Q7
    5500000, // Mercedes-Benz GLC
    4500000, // Lexus RX
    8000000, // Tesla Model X
    7000000, // Porsche Cayenne
    4800000, // Volvo XC90
    5300000, // Range Rover Evoque
    5600000, // Jaguar F-Pace
    5200000  // Ford Mustang
  ];

  const carImages = [
    require('@/assets/bmw_x5.jpg'),
    require('@/assets/audi_q7.jpg'),
    require('@/assets/mercedes_glc.jpg'),
    require('@/assets/lexus_rx.jpg'),
    require('@/assets/tesla_model_x.jpg'),
    require('@/assets/porsche_cayenne.jpg'),
    require('@/assets/volvo_xc90.jpg'),
    require('@/assets/range_rover_evoque.jpg'),
    require('@/assets/jaguar_f_pace.jpg'),
    require('@/assets/ford_mustang.jpg')
  ];

  return {
    id: product.id,
    title: carNames[index % carNames.length],
    image: carImages[index % carImages.length],
    price: carPrices[index % carPrices.length],
    rating: { rate: product.rating.rate },
    category: carCategories[index % carCategories.length],
    description: carDescriptions[index % carDescriptions.length]
  };
};

export const useProductStore = defineStore('products', {
  state: () => {
    return {
      products: [],
      isLoading: false,
      error: {
        isError: false,
        message: null,
        errorCode: null,
        type: null,
        timeout: null,
      },
      serverStatus: {
        isDown: false,
        message: null,
      },
    };
  },

  getters: {
    isProducts: (state) => state.products.length > 0,
    allCategories: (state) => {
      const tmp = state.products.map((product) => product.category);
      tmp.unshift('все');
      return [...new Set(tmp)];
    },

    product: (state) => (id) => {
      return state.products.find((item) => item.id === +id);
    },
  },

  actions: {
    async fetchProducts(attempt = 1) {
      try {
        this.isLoading = true;

        const response = await fetch(BASE_URL);

        if (!response.ok) {
          await wait(1000);
          throw new Error(FETCH_ERROR_MESSAGE, { cause: { status: response.status } });
        }

        const data = await response.json();

        // Адаптируем данные к структуре автомобилей
        this.products = data.map((product, index) => adaptProductData(product, index));
      } catch (e) {
        this.isLoading = false;

        if (attempt <= FETCH_ATTEMPTS_COUNT) {
          this.error = {
            isError: true,
            message: e.message,
            errorCode: e.cause.status,
            timeout: attempt * (FETCH_DELAY_REQUEST_MS / 1000),
          };

          await wait(attempt * FETCH_DELAY_REQUEST_MS);
          return this.fetchProducts(attempt + 1);
        }

        this.serverStatus = { isDown: true, message: SERVER_ERROR_MESSAGE };
      } finally {
        this.isLoading = false;
      }
    },
  },
});
