import React, { Component } from 'react';
import { Animated, Modal, StyleSheet, ScrollView } from 'react-native';

import { ButtonAuth, BlockAuth, TextAuth } from '../components';
import { theme } from '../constants';

class Welcome extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  scrollX = new Animated.Value(0);

  state = {
    showTerms: false,
  };

  renderTermsService() {
    return (
      <Modal
        animationType='slide'
        visible={this.state.showTerms}
        onRequestClose={() => this.setState({ showTerms: false })}
      >
        <BlockAuth
          padding={[theme.sizes.padding * 2, theme.sizes.padding]}
          space='between'
        >
          <TextAuth h2 light>
            Terms of Service
          </TextAuth>

          <ScrollView style={{ marginVertical: theme.sizes.padding }}>
            <TextAuth
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              1. Your use of the Service is at your sole risk. The service is
              provided on an "as is" and "as available" basis.
            </TextAuth>
            <TextAuth
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              2. Support for Expo services is only available in English, via
              e-mail.
            </TextAuth>
            <TextAuth
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              3. You understand that Expo uses third-party vendors and hosting
              partners to provide the necessary hardware, software, networking,
              storage, and related technology required to run the Service.
            </TextAuth>
            <TextAuth
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              4. You must not modify, adapt or hack the Service or modify
              another website so as to falsely imply that it is associated with
              the Service, Expo, or any other Expo service.
            </TextAuth>
            <TextAuth
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              5. You may use the Expo Pages static hosting service solely as
              permitted and intended to host your organization pages, personal
              pages, or project pages, and for no other purpose. You may not use
              Expo Pages in violation of Expo's trademark or other rights or in
              violation of applicable law. Expo reserves the right at all times
              to reclaim any Expo subdomain without liability to you.
            </TextAuth>
            <TextAuth
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              6. You agree not to reproduce, duplicate, copy, sell, resell or
              exploit any portion of the Service, use of the Service, or access
              to the Service without the express written permission by Expo.
            </TextAuth>
            <TextAuth
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              7. We may, but have no obligation to, remove Content and Accounts
              containing Content that we determine in our sole discretion are
              unlawful, offensive, threatening, libelous, defamatory,
              pornographic, obscene or otherwise objectionable or violates any
              party's intellectual property or these Terms of Service.
            </TextAuth>
            <TextAuth
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              8. Verbal, physical, written or other abuse (including threats of
              abuse or retribution) of any Expo customer, employee, member, or
              officer will result in immediate account termination.
            </TextAuth>
            <TextAuth
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              9. You understand that the technical processing and transmission
              of the Service, including your Content, may be transferred
              unencrypted and involve (a) transmissions over various networks;
              and (b) changes to conform and adapt to technical requirements of
              connecting networks or devices.
            </TextAuth>
            <TextAuth
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              10. You must not upload, post, host, or transmit unsolicited
              e-mail, SMSs, or "spam" messages.
            </TextAuth>
          </ScrollView>

          <BlockAuth middle padding={[theme.sizes.base / 2, 0]}>
            <ButtonAuth
              gradient
              onPress={() => this.setState({ showTerms: false })}
            >
              <TextAuth center white>
                I understand
              </TextAuth>
            </ButtonAuth>
          </BlockAuth>
        </BlockAuth>
      </Modal>
    );
  }

  render() {
    const { navigation } = this.props;

    return (
      <BlockAuth>
        <BlockAuth center bottom flex={0.4}>
          <TextAuth h1 center bold>
            Delivering
            <TextAuth h1 primary>
              {' '}
              Mealkits
            </TextAuth>
          </TextAuth>
          {/* <TextAuth h3 gray2 style={{ marginTop: theme.sizes.padding / 2 }}>
            Avoidance and Recoverys
          </TextAuth> */}
        </BlockAuth>

        <BlockAuth middle flex={0.5} margin={[0, theme.sizes.padding * 2]}>
          <ButtonAuth gradient onPress={() => navigation.navigate('Login')}>
            <TextAuth center semibold white>
              Login
            </TextAuth>
          </ButtonAuth>
          <ButtonAuth shadow onPress={() => navigation.navigate('SignUp')}>
            <TextAuth center semibold>
              Signup
            </TextAuth>
          </ButtonAuth>
        </BlockAuth>
      </BlockAuth>
    );
  }
}

export default Welcome;

const styles = StyleSheet.create({
  stepsContainer: {
    position: 'absolute',
    bottom: theme.sizes.base * 3,
    right: 0,
    left: 0,
  },
  steps: {
    width: 5,
    height: 5,
    borderRadius: 5,
    marginHorizontal: 2.5,
  },
});
