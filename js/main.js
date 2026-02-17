Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },

    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText" />
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p class="sale">{{ sale }}</p>
            <a :href="link">More products like this</a>
            
            <p v-if="inventory > 10">In Stock</p>
            <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
            <p v-else :class="{ 'line-through': !inStock }">Out of Stock</p>
            
            <span v-if="inventory <= 5 && inventory > 0">On Sale</span>
            
            <product-details :details="details"></product-details>
            
            <ul>
                <li v-for="size in sizes">{{ size }}</li>
            </ul>
            
            <div class="color-box"
                 v-for="(variant, index) in variants"
                 :key="variant.variantId"
                 :style="{ backgroundColor: variant.variantColor }"
                 @mouseover="updateProduct(index)">
            </div>
            
            <p>Shipping: {{ shipping }}</p>
            
            <div class="cart">
                <p>Cart({{ cart }})</p>
            </div>
            
            <button v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">
                Add to cart
            </button>
            
            <button @click="removeFromCart" :disabled="cart === 0">
                Remove from cart
            </button>
        </div>
    </div>
    `,

    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inventory: 11,
            onSale: false,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
            selectedVariant: 0,
        }
    },

    methods: {
        addToCart() {
            this.cart += 1
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        removeFromCart() {
            if (this.cart > 0) {
                this.cart -= 1
            }
        }
    },

    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        sale() {
            if(this.onSale) {
                return `${this.brand} ${this.product} are on SALE`;
            } else {
                return `${this.brand} ${this.product} are not on SALE`;
            }
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99;
            }
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0;
        }
    }
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>
    `
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
})