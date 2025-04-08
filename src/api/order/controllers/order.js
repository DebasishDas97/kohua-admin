'use strict';
const stripe = require('stripe')(process.env.STRIPE_KEY);

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
    async create(ctx) {
        const { products } = ctx.request.body;

        try {
            const deliveryFee = 40;

            const lineItems = await Promise.all(products.map(async (product) => {
                const item = await strapi.service("api::product.product").findOne(product.id);
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: item.title,
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: product.quantity,
                };
            }));

            // Add a separate line item for the delivery fee
            lineItems.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Delivery Fee",
                    },
                    unit_amount: deliveryFee * 100, // Assuming delivery fee is in the smallest currency unit
                },
                quantity: 1, // Assuming delivery fee is a flat fee
            });

            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                success_url: process.env.CLIENT_URL + "success",
                cancel_url: process.env.CLIENT_URL + "?success=false",
                line_items: lineItems,
                shipping_address_collection: { allowed_countries: ["IN"] },
                phone_number_collection: {
                    enabled: true,
                },
            });

            await strapi.service("api::order.order").create({
                data: { products, stripeid: session.id },
            });

            return { stripeSession: session };
        } catch (err) {
            ctx.response.status = 500;
            return { err };
        }

    }
}));
