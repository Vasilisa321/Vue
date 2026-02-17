let eventBus = new Vue();

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
});

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
        
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        
        <p>
            <label>Would you recommend this product?</label><br>
            <input type="radio" id="recommend-yes" value="yes" v-model="recommend">
            <label for="recommend-yes">Yes</label>
            <input type="radio" id="recommend-no" value="no" v-model="recommend">
            <label for="recommend-no">No</label>
        </p>

        <p>
            <input type="submit" value="Submit"> 
        </p>
    </form>
    `,

    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },

    methods: {
        onSubmit() {
            this.errors = [];

            if(!this.name) this.errors.push("Name required.");
            if(!this.review) this.errors.push("Review required.");
            if(!this.rating) this.errors.push("Rating required.");
            if(!this.recommend) this.errors.push("Recommendation required.");

            if(this.errors.length === 0) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                eventBus.$emit('review-submitted', productReview);

                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
            }
        }
    }
});

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        },
        premium: {
            type: Boolean,
            required: true
        },
        details: {
            type: Array,
            required: true
        },
        sizes: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
        <div class="tabs">
            <span 
                class="tab" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs" 
                :key="index"
                @click="selectedTab = tab"
            >{{ tab }}</span>
        </div>
        
        
        <div v-show="selectedTab === 'Reviews'">
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews" :key="review.name + review.rating">
                    <p><strong>{{ review.name }}</strong></p>
                    <p>Rating: {{ review.rating }}/5</p>
                    <p>{{ review.review }}</p>
                    <p>Recommends: {{ review.recommend === 'yes' ? 'Yes' : 'No' }}</p>
                </li>
            </ul>
        </div>
        
        <div v-show="selectedTab === 'Make a Review'">
            <product-review></product-review>
        </div>
        
        <div v-show="selectedTab === 'Shipping'">
            <h2>Shipping</h2>
            <p>Shipping cost: {{ shippingCost }}</p>
            <p v-if="premium">Free shipping for premium members!</p>
        </div>
     
        <div v-show="selectedTab === 'Details'">
            <h2>Product Details</h2>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
            <p>Available sizes: 
                <span v-for="(size, index) in sizes" :key="index">
                    {{ size }}{{ index < sizes.length - 1 ? ', ' : '' }}
                </span>
            </p>
        </div>
    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    },
    computed: {
        shippingCost() {
            return this.premium ? 'Free' : '$2.99';
        }
    }
});

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
            <img :src="image" :alt="altText"/>
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            
            
            <p v-if="inStock && inventory > 10">In Stock</p>
            <p v-else-if="inStock && inventory <= 10 && inventory > 0">Almost sold out!</p>
            <p v-else :class="{ 'line-through': !inStock }">Out of Stock</p>
            
            
            <span v-if="inventory <= 5 && inventory > 0" class="sale">On Sale</span>
            
            
            <div
                class="color-box"
                v-for="(variant, index) in variants"
                :key="variant.variantId"
                :style="{ backgroundColor: variant.variantColor }"
                @mouseover="updateProduct(index)"
            ></div>
            
           
            <div class="cart-buttons">
                <button
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
                >
                    Add to cart
                </button>
                
                <button @click="removeFromCart" :disabled="!inStock">
                    Remove from cart
                </button>
            </div>
        </div>           
        
      
        <product-tabs 
            :reviews="reviews"
            :premium="premium"
            :details="details"
            :sizes="sizes"
        ></product-tabs>
    </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            inventory: 11,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
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
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0;
        }
    },
    mounted() {
        eventBus.$on('review-submitted', (productReview) => {
            this.reviews.push(productReview);
        });
    }
});

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
            console.log('Товар добавлен в корзину. ID:', id);
            console.log('Корзина:', this.cart);
        },
        removeFromCart(id) {
            const index = this.cart.lastIndexOf(id);
            if (index !== -1) {
                this.cart.splice(index, 1);
                console.log('Товар удален из корзины. ID:', id);
                console.log('Корзина:', this.cart);
            }
        }
    }
});