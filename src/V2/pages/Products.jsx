import React from 'react'
import HeroSection from '../components/core/Products/HeroSection'
import { productsData } from '../constants/ProductsData'
import ProductSection from '../components/core/Products/ProductSection'
import WhyOrionSection from '../components/core/Products/WhyOrionSection'

const Products = () => {
    return (
        <>
            <HeroSection />
            {
                productsData.map((data, index) => <ProductSection key={data.id} data={data} index={index} />)
            }
            <WhyOrionSection />
        </>
    )
}

export default Products
