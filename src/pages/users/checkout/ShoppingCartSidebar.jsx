import React, { useState } from 'react';
import useShoppingCartSidebar from '../../authentication/customHooks/useShoppingCartSidebar';
import '../checkout/css/ShoppingCartSidebar.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../authentication/customHooks/useAuth';
import { useContext } from 'react';
import Context from '../../authentication/customHooks/Auth';

function ShoppingCartSidebar({ isOpen, onClose }) {

    const navigate = useNavigate();

    const { products, orderHasProduct, totalPrice, handleDeleteProductFromCart } = useShoppingCartSidebar();

    const { cart } = useContext(Context);


    if (!products || !orderHasProduct) {
        return <p>The cart is empty</p>;
    }

    useEffect(() => {
        console.log('Carrito actualizado en ShoppingCartSidebar:', cart);
    
        if (isOpen && cart.recentlyAddedProduct) {
            console.log('Producto recién añadido en ShoppingCartSidebar:', cart.recentlyAddedProduct);
        }
    }, [cart, isOpen]);
    
      

    useEffect(() => {
        console.log('Carrito actualizado en ShoppingCartSidebar:', cart);

        if (isOpen && cart.recentlyAddedProduct) {
            console.log('Producto recién añadido en ShoppingCartSidebar:', cart.recentlyAddedProduct);
        }
    }, [cart, isOpen]);



    return (
        <div className={`shopping-cart-sidebar shopping-cart-sidebar-custom ${isOpen ? 'open' : ''}`}>
            <h3 className='shopping-cart-sidebar-header'>Shopping Cart</h3>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <img
                            className="product-image-sidebar"
                            src={`data:image/jpeg;base64,${product.image}`}
                            alt={product.title}
                        />
                        {product.title} - Quantity: {orderHasProduct.find((item) => item.id === product.id)?.quantity}
                        <button className='shopping-cart-sidebar-delete' onClick={() => handleDeleteProductFromCart(product.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <p className='shopping-cart-sidebar-total'>Total Price: {totalPrice} €</p>
            <button
                className="btn cart-checkout-btn"
                onClick={() => navigate('/checkout', { state: { shoppingCart: products, total: totalPrice, orderHasProduct } })}
            >
                Go to Checkout
            </button>
            <button onClick={() => { onClose(); navigate('/shoppingCart'); }} className="shopping-cart-sidebar-shoppingcart">
                See Cart
            </button>
        </div>
    );
}

export default ShoppingCartSidebar;