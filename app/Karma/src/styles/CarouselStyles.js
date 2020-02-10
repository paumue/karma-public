import { StyleSheet, Dimensions, Platform } from 'react-native';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideWidth = wp(85);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
export const itemHeight = itemWidth * 1.1;

const CarouselStyles = StyleSheet.create({
    slider: {
        marginTop: 16,
        overflow: "visible",
    },
    itemContainer: {
        marginBottom: IS_IOS ? 0 : -1,
        width: itemWidth,
        height: itemHeight,
        overflow: "visible",
    },
    item: {
        padding: 16,
        backgroundColor: "white",
        position: "absolute",
        top: 8,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 8,
        borderRadius: 6,
        borderBottomWidth: 16,
        borderBottomColor: "#00bab9",
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    }
});

export default CarouselStyles;
