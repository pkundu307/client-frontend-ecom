import React from 'react'
import TrendingProducts from '../components/Trending'
import CategoryGrid from '../components/CategoryGrid'
import Demand from '../components/Demand'
import PublicFavorite from '../components/Pf'
import WeekSpecial from '../components/WeekSpecial'
import BasedOnYourActivity from '../components/suggested'

const Home = () => {
  return (
    <div>
      <TrendingProducts/>
      <CategoryGrid/>
      <Demand/>
      <BasedOnYourActivity/>
      <PublicFavorite/>
      <WeekSpecial/>
    </div>
  )
}

export default Home
