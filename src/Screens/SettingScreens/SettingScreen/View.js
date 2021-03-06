
//================================ React Native Imported Files ======================================//

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, FlatList, StatusBar, Image, Text, TouchableOpacity, Modal, Platform, Alert } from 'react-native';
import React from 'react';

//================================ Local Imported Files ======================================//

import SettingsItem from '../../../Components/SettingsItem/SettingItem';
import AppHeader from '../../../Components/AppHeader/AppHeader';
import RateApp from "../../../Components/RateModel/RateApp";
import images from '../../../Assets/Images/images';
import colors from '../../../Assets/Colors/colors';
import styles from "./Styles";
import SettingsModel from '../../../Components/SettingModel/SettingModel';
import { connect } from 'react-redux'
import {updateUser, updateUserProfile} from '../../../reducers/user'
import auth from '@react-native-firebase/auth';
import { CommonActions } from '@react-navigation/native';
import Share from "react-native-share";
import SettingLang from "../../../Components/SettingLang";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-community/async-storage";
import I18n from "../../../i18n";

class SettingsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalVisibleSetting: false,
            modalVisibleLang: false,
            //================================ Data array ======================================//
            Data: [
                {
                    id: 1,
                    title: 'Share the App to Social Media',
                    firstIcon: images.ic_share_settings,
                    secondIcon: images.ic_chevron_right,

                },
                {
                    id: 2,
                    title: 'About the App',
                    firstIcon: images.ic_send_feedback_settings,
                    secondIcon: images.ic_chevron_right,

                },
                {
                    id: 3,
                    title: 'Rate App',
                    firstIcon: images.ic_rate_app_settings,
                    secondIcon: images.ic_chevron_right,

                },
                {
                    id: 4,
                    title: 'Report a Problem',
                    firstIcon: images.ic_send_feedback_settings,
                    secondIcon: images.ic_chevron_right,



                },
                {
                    id: 5,
                    title: 'Terms And Conditions',
                    firstIcon: images.ic_terms,
                    secondIcon: images.ic_chevron_right,

                },
                {
                    id: 6,
                    title: 'Privacy Policy',
                    firstIcon: images.ic_lock,
                    secondIcon: images.ic_chevron_right,

                },
                {
                    id: 7,
                    title: 'Language',
                    firstIcon: images.ic_key,
                    secondIcon: images.ic_chevron_right,

                },
            ]
        }
    }

    //================================ Model Functions ======================================//

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };

    inVisible() {
        this.setState({ modalVisible: false })
    }
    setmodalVisibleSetting = (visible) => {
        this.setState({ modalVisibleSetting: visible });
    };

    inVisible() {
        this.setState({ modalVisibleSetting: false })
    }

    onChangeLang = (lang) => {
        const { profile, user } = this.props;
        if(!profile.language || profile.language !== lang){
            console.log('lang', lang);
            const profile_doc = firestore().collection('users').doc(user.uid)
            profile_doc
                .update({ language: lang })
                .then(async (res) => {
                    await AsyncStorage.setItem('language', lang);
                    I18n.locale = lang;
                    profile_doc.get().then(res => {
                        console.log("upated profile:", res.data())
                        this.props.updateUserProfile(res.data())
                    })
                })
        }
        this.setState({modalVisibleLang: false});
    }

    onClickListItem(id) {
        switch (id) {
            case 1: {
                const url = Platform.OS == 'ios' ? 'https://apps.apple.com/' : 'https://play.google.com/store/apps';
                const title = 'EZFind';
                const message = Platform.OS == 'ios' ? I18n.t('Got_something_useful_you_want_to_dispose_on_the_app_store') : I18n.t('Got_something_useful_you_want_to_dispose_on_the_google_store');
                const icon = '';
                const options = Platform.select({
                    ios: {
                        activityItemSources: [
                            { // For sharing url with custom title.
                                placeholderItem: { type: 'url', content: url },
                                item: {
                                    default: { type: 'url', content: url },
                                },
                                subject: {
                                    default: title,
                                },
                                linkMetadata: { originalUrl: url, url, title },
                            },
                            { // For sharing text.
                                placeholderItem: { type: 'text', content: message },
                                item: {
                                    default: { type: 'text', content: message },
                                    message: null, // Specify no text to share via Messages app.
                                },
                                linkMetadata: { // For showing app icon on share preview.
                                    title: message
                                },
                            },
                            { // For using custom icon instead of default text icon at share preview when sharing with message.
                                placeholderItem: {
                                    type: 'url',
                                    content: icon
                                },
                                item: {
                                    default: {
                                        type: 'text',
                                        content: `${message} ${url}`
                                    },
                                },
                                linkMetadata: {
                                    title: message,
                                    icon: icon
                                }
                            },
                        ],
                    },
                    default: {
                        title,
                        subject: title,
                        message: `${message} ${url}`,
                    },
                });

                Share.open(options);
                break;
            }

            case 2:
                this.setmodalVisibleSetting(true);
                break;

            case 3:
                this.setModalVisible(true);
                break;

            case 4:
                this.props.navigation.navigate('SendFeedback');
                break;

            case 5:
                this.props.navigation.navigate('TermsAndCondtions');
                break;

            case 6:
                this.props.navigation.navigate('PrivacyScreen');
                break;

            case 7:
                this.setState({modalVisibleLang: true});
                break;
        }
    }
    //================================ Setting Item Function ======================================//
    list(item) {
        return (
            <SettingsItem
                onPress={() => {
                    this.onClickListItem(item.id)
                }}
                upperText={I18n.t(item.title)}
                leftIconImage={item.firstIcon}
                arrowImage={item.secondIcon}
                switchItem={item.switchItem}
                rightIconColor={colors.grey1}
                rightIconSize={wp(3.5)}
                leftIconSize={wp(3.5)}
                height={hp(6.5)}
                backgroundColor={'rgba(255, 255, 255, 0.6)'}
                leftIconColor={item.color}
                textColor={item.color}
                toggleSwitchButton={item.toggleSwitchButton}
            />
        )
    }
    render() {
        const { modalVisible } = this.state;
        const { modalVisibleSetting, modalVisibleLang } = this.state;
        console.log('language', this.props.user);

        return (
            <View style={styles.mainContainer}>
                {/* //================================ StatusBar ======================================// */}

                <StatusBar barStyle="dark-content" hidden={false} backgroundColor={colors.AppGreenColor} translucent={false} />

                {/* //================================ Header ======================================// */}

                <View style={styles.headerView}>
                    <AppHeader
                        headerHeight='100%'
                        // leftText={'left'}
                        leftIconPath={images.ic_hamburger_menu}
                        lefticonSize={wp(5)}
                        title={I18n.t('SETTINGS')}
                        bgColor={colors.AppGreenColor}
                        titleFontSize={wp(6)}
                        onLeftIconPress={() => this.props.navigation.openDrawer()}
                    />
                </View>
                {/* //================================ FlatList ======================================// */}
                <View style={styles.container}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.state.Data}
                        renderItem={({ item }) => this.list(item)}
                        keyExtractor={item => item.id + ''}
                    />

                </View>
                {/* //================================ Model ======================================// */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!modalVisible);
                    }}>
                    <RateApp
                        onPressLater={() => {
                            this.setModalVisible(!modalVisible)
                        }}
                    />
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisibleSetting}
                    onRequestClose={() => {
                        this.setmodalVisibleSetting(!modalVisibleSetting);
                    }}>
                    <SettingsModel
                        onPressCancel={() => {
                            this.setmodalVisibleSetting(!modalVisibleSetting)
                        }}
                    />
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisibleLang}
                    onRequestClose={() => {
                        this.setState({ modalVisibleLang:!modalVisibleLang });
                    }}>
                    <SettingLang
                        language={this.props.profile.language??'en'}
                        onPressOk={this.onChangeLang}
                        onPressCancel={() => {
                            this.setState({ modalVisibleLang:!modalVisibleLang });
                        }}
                    />
                </Modal>
                {/* //================================ Logout ======================================// */}
                <TouchableOpacity style={styles.logout}
                    onPress={() => {
                        Alert.alert(
                            I18n.t("Logout"),
                            I18n.t("Are you sure to logout"),
                            [
                                {
                                    text: I18n.t("Cancel"),
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                {
                                    text: I18n.t("Ok"), onPress: () => {


                                        try {
                                            auth()
                                                .signOut()
                                                .then(async () => {
                                                    await AsyncStorage.removeItem('language');
                                                    this.props.updateUser()
                                                    this.props.navigation.dispatch(
                                                        CommonActions.reset({
                                                            index: 1,
                                                            routes: [
                                                                { name: 'SignupWith' },
                                                                {
                                                                    name: 'LoginScreen',
                                                                },
                                                            ],
                                                        })
                                                    );
                                                    console.log('User signed out!')
                                                }).catch(e => {
                                                    this.props.updateUser()
                                                });
                                        } catch (e) {
                                            this.props.updateUser()
                                            return
                                        }
                                    }
                                }
                            ],
                            { cancelable: false }
                        );

                    }}
                >
                    <Image
                        style={styles.logoutIcon}
                        source={images.ic_logout_settings}
                    />
                    <Text style={[styles.textStyle, {
                        color: colors.bright_red
                    }]}>{I18n.t('Log Out')}</Text>

                </TouchableOpacity>
            </View>
        )
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
    profile: state.user.profile
})

const mapDispatchToProps = {
    updateUser,
    updateUserProfile
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)