import React from 'react'
import {
   FacebookShareButton,
   FacebookIcon,
   FacebookMessengerShareButton,
   FacebookMessengerIcon,
   TwitterShareButton,
   TwitterIcon,
   WhatsappShareButton,
   WhatsappIcon,
   LinkedinShareButton,
   LinkedinIcon,
   RedditShareButton,
   RedditIcon,
   TumblrShareButton,
   TumblrIcon,
} from 'react-share'
import styled from 'styled-components/native'

const SocialMediaShareButtons = () => {
   return (
      <ShareButtonsWrapper>
         <FacebookShareButton
            url={window.location}
            style={{
               alignItems: 'center',
               justifyContent: 'center',
               marginRight: 8,
            }}
         >
            <FacebookIcon size={24} round={true} />
         </FacebookShareButton>
         <FacebookMessengerShareButton
            url={window.location}
            style={{
               alignItems: 'center',
               justifyContent: 'center',
               marginRight: 8,
            }}
         >
            <FacebookMessengerIcon size={24} round={true} />
         </FacebookMessengerShareButton>
         <TwitterShareButton
            url={window.location}
            style={{
               alignItems: 'center',
               justifyContent: 'center',
               marginRight: 8,
            }}
         >
            <TwitterIcon size={24} round={true} />
         </TwitterShareButton>
         <WhatsappShareButton
            url={window.location}
            style={{
               alignItems: 'center',
               justifyContent: 'center',
               marginRight: 8,
            }}
         >
            <WhatsappIcon size={24} round={true} />
         </WhatsappShareButton>
         <RedditShareButton
            url={window.location}
            style={{
               alignItems: 'center',
               justifyContent: 'center',
               marginRight: 8,
            }}
         >
            <RedditIcon size={24} round={true} />
         </RedditShareButton>
         <LinkedinShareButton
            url={window.location}
            style={{
               alignItems: 'center',
               justifyContent: 'center',
               marginRight: 8,
            }}
         >
            <LinkedinIcon size={24} round={true} />
         </LinkedinShareButton>
         <TumblrShareButton
            url={window.location}
            style={{
               alignItems: 'center',
               justifyContent: 'center',
               marginRight: 8,
            }}
         >
            <TumblrIcon size={24} round={true} />
         </TumblrShareButton>
      </ShareButtonsWrapper>
   )
}

export default SocialMediaShareButtons

const ShareButtonsWrapper = styled.View`
   flex-direction: row;
   align-items: center;
`
