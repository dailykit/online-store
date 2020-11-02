import React from 'react'
import { Feather } from '@expo/vector-icons'
import styled from 'styled-components/native'
import { useAppContext } from '../context/app'

const ServingTypes = ({ types, selected, onSelect }) => {
   const { visual } = useAppContext()

   return (
      <TypeWrapper>
         {types.map(type => (
            <Type active={selected === type} onPress={() => onSelect(type)}>
               <TypeText>
                  {type === 'mealKit' ? 'Meal Kit' : 'Ready to Eat'}
               </TypeText>
               {Boolean(selected === type) && (
                  <Feather
                     name="check-circle"
                     style={{ marginLeft: 8 }}
                     size={18}
                     color={visual.color}
                  />
               )}
            </Type>
         ))}
      </TypeWrapper>
   )
}

export default ServingTypes

const TypeWrapper = styled.View`
   flex-direction: row;
   height: 48px;
   margin-bottom: 16px;
`

const Type = styled.TouchableOpacity`
   height: inherit;
   min-width: 96px;
   background: ${props => (props.active ? '#fff' : '#eae8e8')};
   flex-direction: row;
   align-items: center;
   border: 1px solid #eae8e8;
   justify-content: center;
   padding: 0 12px;
`

const TypeText = styled.Text`
   color: #000;
`
