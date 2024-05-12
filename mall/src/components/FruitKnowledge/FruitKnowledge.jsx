import React from 'react'
import PropTypes from 'prop-types';
import './FruitKnowledge.css'

export default function FruitKnowledge(props) {
  const { knowledge_title, knowledge_img, knowledge_content, fruit_sub_logo } = props.knowledgeInfo
  return (
    <div>
      <div className='fruit_knowledge'>
        <p className="knowledge_title">{knowledge_title}</p>
        <img src={knowledge_img} alt="" />
        <div className='knowledge_content'>
          <p>{knowledge_content}</p>
        </div>

      </div>
      {/* <div className='fruit_sub_logo'>
        <img src={fruit_sub_logo} alt="" />
      </div> */}
    </div>

  )
}
FruitKnowledge.propTypes = {
  knowledgeInfo: PropTypes.object.isRequired
};