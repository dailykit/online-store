import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'
import { useAppContext } from '../../context/app'
import { width } from '../../utils/Scaling'

const MenuSkeleton = () => {
   const fadeAnim = React.useRef(new Animated.Value(0)).current
   const { visual } = useAppContext()

   React.useEffect(() => {
      Animated.loop(
         Animated.sequence([
            Animated.timing(fadeAnim, {
               toValue: 1,
               duration: 1000,
               delay: 500,
            }),
            Animated.timing(fadeAnim, {
               toValue: 0,
               duration: 1000,
               delay: 500,
            }),
         ])
      ).start()
   }, [])

   return (
      <>
         <CategorySkeleton>
            <NameSkeleton />
            <Animated.View
               style={{
                  height: '14px',
                  width: '100px',
                  borderRadius: 2,
                  backgroundColor: visual.color || '#aaa',
                  opacity: fadeAnim,
               }}
            />
         </CategorySkeleton>
         <CategorySkeleton>
            <NameSkeleton />
            <Animated.View
               style={{
                  height: '14px',
                  width: '100px',
                  borderRadius: 2,
                  backgroundColor: visual.color || '#aaa',
                  opacity: fadeAnim,
               }}
            />
         </CategorySkeleton>
         <CategorySkeleton>
            <NameSkeleton />
            <Animated.View
               style={{
                  height: '14px',
                  width: '100px',
                  borderRadius: 2,
                  backgroundColor: visual.color || '#aaa',
                  opacity: fadeAnim,
               }}
            />
         </CategorySkeleton>
      </>
   )
}

export default MenuSkeleton

const CategorySkeleton = styled.View`
   background: #fff;
   height: 60px;
   align-items: center;
   justify-content: space-between;
   padding: 0 16px;
   flex-direction: row;
   margin: ${width > 768 ? '16px' : '10px'};
`

const NameSkeleton = styled.View`
   height: 32px;
   width: 175px;
   background-color: #aaa;
   border-radius: 2px;
   opacity: 0.5;
`
