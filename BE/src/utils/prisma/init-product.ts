import { prisma } from '../../config/prisma.config'

const categories = ["Laptop", "Phone", "Tablet"]
const brands = [
  [
    "Macbook",
    "Asus",
    "Dell"
  ],
  [
    "Iphone",
    "Samsung",
    "Xiaomi"
  ],
  [
    "Ipad"
  ]
]
const seriesOfLaptop = [
  [
    "Macbook Air",
    "Macbook Pro",
  ],
  [
    "Asus Zenbook",
    "Asus Rog"
  ],
  [
    "Dell XPS",
    "Dell Inspiron"
  ]
]
const products = [
  {
    id: 1,
    name: "Macbook Air M1",
    description: "Macbook Air M1",
    quantity: 15,
    brand_id: 1,
    is_active: true,
    series_id: 1,
    category_id: 1,
    variants: [
      {
        id: 1,
        color: "black",
        storage: "256GB",
        import_price: 20000000,
        price: 22000000,
        quantity: 5
      },
      {
        id: 2,
        color: "white",
        storage: "256GB",
        import_price: 20000000,
        price: 22000000,
        quantity: 10
      }
    ]
  },
  {
    id: 2,
    name: "Dell XPS 13",
    description: "Dell XPS 13",
    quantity: 10,
    brand_id: 3,
    is_active: true,
    series_id: 1,
    category_id: 1,
    variants: [
      {
        id: 1,
        color: "black",
        storage: "256GB",
        import_price: 20000000,
        price: 22000000,
        quantity: 5
      },
      {
        id: 2,
        color: "white",
        storage: "256GB",
        import_price: 20000000,
        price: 22000000,
        quantity: 5
      }
    ]
  }
]
export const initProduct = async () => {
  console.log("Creating sample products...");
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const type of brands) {
    for ( let i = 0 ; i < type.length ; i++) {
      await prisma.brand.upsert({
        where: { name: type[i] },
        update: {},
        create: {
          name: type[i],
          category_id: i+1,
          description: "Nhãn hàng tốt nhất thị trường ở các phân khúc"
        },
      });
    }
  }
  
  // TODO: Fix this
  for(let i = 1 ; i <= seriesOfLaptop.length ; i++) {
    for ( let j = 1 ; j <= seriesOfLaptop[i-1].length ; j++) {
      await prisma.series.upsert({
        where: {
          name: seriesOfLaptop[i-1][j-1]
        },
        update: {},
        create: {
          id: j,
          name: seriesOfLaptop[i-1][j-1],
          brand_id: i,
        },
      });
    }
  }

  for (const product of products){
    await prisma.product.upsert({
      where:{
          id: product.id
      },
      update: {},
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        brand_id: product.brand_id,
        is_active: product.is_active,
        series_id: product.series_id,
        category_id: product.category_id,
        product_variants: {
            createMany: {
                data: product.variants
            }
        }
      }
    })
  }
}