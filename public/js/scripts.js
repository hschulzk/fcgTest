
"use strict"
window.addEventListener('DOMContentLoaded', () => {
  const app = (() => {
      const appState = {
        products: [],
        pagination: {},
      };

      const productContainer = document.getElementById("products");
      const productPagination = document.getElementById("products-pagination");
      const productModal = document.getElementById("product_modal");

      // Select the modal elements
      const modalProductImage = document.getElementById("modal_product_image");
      const modalProductName = document.getElementById("modal_product_name");

      // Modal Product Details
      const modalProductPrice = document.getElementById("modal_product_price");
      const modalProductDescription = document.getElementById("modal_product_description");
      const modalProductSupplier = document.getElementById("modal_product_supplier");

      // Bind the close event when you click outside the main modal
      productModal.onclick = (e) => !e.target.closest(".modal_product_content") ?  closeModal() : null;



      const createPagination = (dataSet, size=2, regenFunc) => {
        const totalPages = dataSet % size ? (dataSet.length / size) + 1 : dataSet.length / size;
        const paginator = () => {
          // Build local state
          const data = {
            currentPage: 0,
            totalPages: totalPages,
            pageSize: size,
          }
          const getPaginationData = () => {
            return data;
          }
          const pageUp = () => {
            data.currentPage + 1 < data.totalPages ? 
              data.currentPage += 1
            : 
             null
          }
          const setPage = (pageNum) => {
            data.currentPage = pageNum;
            regenFunc();
          }

          data.pageUp =  () => pageUp();
          data.getPaginationData = () => getPaginationData();
          data.setPage = (page) => setPage(page);
          // Create buttons
          const paginationList = document.createElement('ul');

          paginationList.classList.add('pagination_list');

          for(let i = 0; i < data.totalPages; i++) {
            const pageButton = document.createElement('li');
            pageButton.classList.add('pagination_button')
            const buttonText = document.createTextNode(i+1);
            pageButton.appendChild(buttonText);
            pageButton.onclick = (e) => {
              setPage(i)
              const allButtons = paginationList.querySelectorAll('.pagination_button');
              allButtons.forEach((item) => {
                if(item.classList.contains('active')) {
                  item.classList.remove('active');
                }
              });
              e.target.classList.add('active');
            }
            paginationList.appendChild(pageButton);
          }
          productPagination.appendChild(paginationList);
          return data;
        }
        return paginator();
      };
      
      
      const createProductGridItem = (productItem) => {
        const productWrapper = document.createElement('div');
        productWrapper.classList.add('product');
        // create the image holder
        const imgCont = document.createElement('div');
        imgCont.classList.add('image_wrapper');
        // create a new product image element
        const productImage = document.createElement('img');
        productImage.src = productItem.image;
        productImage.alt = productItem.name;
        imgCont.appendChild(productImage);
      
      
        // create the product name
        const nameCont = document.createElement('div');
        const productNameText = document.createTextNode(`${productItem.name}`);
        nameCont.appendChild(productNameText)
        // Unisex Long Sleeve Round Neck T-Shirt w/ Sublimation Tshirts
      
        // create the product price holder
        const priceCont = document.createElement('div');
        const productPriceText = document.createTextNode(`$${productItem.price}`);
        priceCont.appendChild(productPriceText)
      
        productWrapper.appendChild(imgCont);
        // put the headerText inside the h1 element
        productWrapper.appendChild(nameCont);
        // put the header element inside the container div
        productWrapper.appendChild(priceCont);
        productWrapper.onclick = (e) => {
          openModal(productItem)
        }
        // put the newly created div inside the body of our page (or document)
        return productWrapper;
      };

      const openModal = (productInfo) => {
        // hydrate modal
        modalProductImage.src = productInfo.image;
        modalProductImage.alt = productInfo.name;
        modalProductName.innerHTML = productInfo.name;
        modalProductDescription.innerHTML = productInfo.desc;
        modalProductPrice.innerHTML = `$${productInfo.price}`;
        modalProductSupplier.innerHTML = productInfo.supplierName;
        // Set modal active
        if(!productModal.classList.contains('active')) {
          productModal.classList.add('active');
        }
      };

      const closeModal  = () => {
        if(productModal.classList.contains('active')) {
          productModal.classList.remove('active');
        }
        // set modal inactive
        // dehydrate modal
      };


      const getProducts = () => {
        const products = fetch('http://localhost:3002/products').then((p) => {
          return p.ok ? 
            p.status == 200 ?
              p.json()
            :  false
              : false
        }).catch((err) => {
          console.log(err);
          return false;
        });
        return products;
      }
      const generateProductView = () => {
        const {
          products,
          pagination,
        } = appState;
        const paginationData = pagination.getPaginationData();
        const startIndex = paginationData.currentPage;
        const endIndex = startIndex + paginationData.pageSize;
        productContainer.innerHTML = '';
        for(let i = startIndex; i < endIndex; i++) {
          productContainer.appendChild(createProductGridItem(products[i]));
        }
      }

      const init = async () => {
        appState.products = await getProducts(appState.products);
        appState.pagination = await createPagination(appState.products, 10, generateProductView);
        return appState.products;
      }

      init().then(generateProductView);

  })()
})
