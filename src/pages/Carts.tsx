import React, { useState, useEffect } from 'react';
import {
    Typography,
    Row,
    Col,
    Image,
    Button,
    InputNumber,
    Divider,
    Spin,
    message
} from 'antd';
import {
    ShoppingCartOutlined,
    DeleteOutlined,
    ShoppingOutlined,
    MinusOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import FacingLayout from '../components/FacingLayout';
import {Cart, Product} from "../types/types.ts";
import {fetchProducts} from "../services/productsService.ts";
import {fetchCarts} from "../services/cartsService.ts";

const { Title, Text, Paragraph } = Typography;

interface CartItem extends Cart {
    product: Product;
    subtotal: number;
}

const Carts: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Calculate cart summary
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingFee = subtotal > 0 ? 5.99 : 0;
    const tax = subtotal * 0.1; // Assuming 10% tax
    const total = subtotal + shippingFee + tax;

    useEffect(() => {
        // Function to fetch cart data
        const fetchCartData = async () => {
            try {
                setLoading(true);

                // This will be replaced with actual API call
                const fetchedCarts = await fetchCarts();

                // Mock products for demonstration
                const products = await fetchProducts();

                // Map cart items with product details
                const cartWithProducts = fetchedCarts.map(cart => {
                    const product = products.find(p => p.id === cart.productId);
                    return {
                        ...cart,
                        product: product!,
                        subtotal: product!.price * cart.quantity
                    };
                });

                setCartItems(cartWithProducts);
            } catch (error) {
                console.error("Failed to fetch cart data:", error);
                message.error("Failed to load cart items. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);

    const handleQuantityChange = (id: number, newQuantity: number | null) => {
        if (newQuantity === null || newQuantity < 1) return;

        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    const updatedQuantity = Math.min(newQuantity, item.product.stock);
                    return {
                        ...item,
                        quantity: updatedQuantity,
                        subtotal: item.product.price * updatedQuantity
                    };
                }
                return item;
            })
        );
    };

    const handleRemoveItem = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        message.success("Item removed from cart");
    };

    const handleCheckout = () => {
        message.info("Proceeding to checkout... This feature is coming soon!");
    };

    if (loading) {
        return (
            <FacingLayout>
                <div className="cart-section">
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                        <Spin size="large" />
                    </div>
                </div>
            </FacingLayout>
        );
    }

    if (cartItems.length === 0) {
        return (
            <FacingLayout>
                <div className="cart-section">
                    <div className="cart-empty-container">
                        <ShoppingCartOutlined className="cart-empty-icon" />
                        <Title level={3} className="cart-empty-title">Your cart is empty</Title>
                        <Paragraph className="cart-empty-text">
                            Looks like you haven't added any items to your cart yet.
                        </Paragraph>
                        <Link to="/products">
                            <Button type="primary" icon={<ShoppingOutlined />} className="cart-empty-button">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </FacingLayout>
        );
    }

    return (
        <FacingLayout>
            <div className="cart-section">
                <Title level={2} className="cart-title">Your Shopping Cart</Title>

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={16}>
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <Row align="middle">
                                    <Col xs={24} sm={6} md={4}>
                                        <Link to={`/products/${item.product.id}`}>
                                            <Image
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                className="cart-item-image"
                                                preview={false}
                                                fallback="data:image/png;base64,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"
                                            />
                                        </Link>
                                    </Col>
                                    <Col xs={24} sm={18} md={12} className="cart-item-info">
                                        <Link to={`/products/${item.product.id}`}>
                                            <Title level={5} className="cart-item-name">{item.product.name}</Title>
                                        </Link>
                                        <Text className="cart-item-description">{item.product.description}</Text>
                                        <Text className="cart-item-price">${item.product.price.toFixed(2)}</Text>

                                        <div className="cart-quantity-controls">
                                            <Button
                                                icon={<MinusOutlined />}
                                                className="quantity-btn"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            />
                                            <InputNumber
                                                min={1}
                                                max={item.product.stock}
                                                value={item.quantity}
                                                onChange={(value) => handleQuantityChange(item.id, value)}
                                                className="quantity-input"
                                            />
                                            <Button
                                                icon={<PlusOutlined />}
                                                className="quantity-btn"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stock}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={24} md={8} className="cart-item-controls">
                                        <div className="cart-item-subtotal">
                                            ${item.subtotal.toFixed(2)}
                                        </div>
                                        <Button
                                            icon={<DeleteOutlined />}
                                            className="cart-remove-btn"
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            Remove
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </Col>

                    <Col xs={24} md={8}>
                        <div className="cart-summary">
                            <Title level={4} className="summary-title">Order Summary</Title>

                            <div className="summary-row">
                                <Text className="summary-label">Subtotal</Text>
                                <Text className="summary-value">${subtotal.toFixed(2)}</Text>
                            </div>

                            <div className="summary-row">
                                <Text className="summary-label">Shipping</Text>
                                <Text className="summary-value">${shippingFee.toFixed(2)}</Text>
                            </div>

                            <div className="summary-row">
                                <Text className="summary-label">Tax</Text>
                                <Text className="summary-value">${tax.toFixed(2)}</Text>
                            </div>

                            <Divider className="summary-divider" />

                            <div className="summary-row">
                                <Text strong className="summary-label">Total</Text>
                                <Text className="summary-total">${total.toFixed(2)}</Text>
                            </div>

                            <Button
                                type="primary"
                                className="checkout-btn"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </Button>

                            <div className="continue-shopping">
                                <Link to="/products" className="continue-btn">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </FacingLayout>
    );
};

export default Carts;