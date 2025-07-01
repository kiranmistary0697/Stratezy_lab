
//export const paperStyle = {
//    p: 2,
//    mb: 2,
//    mt: 4,
//    borderRadius: 4, // Smooth rounded corners
//    backgroundColor: '#ffffff', // Clean white background
//    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
//    position: 'relative',
//    '&::before': {
//        content: '""',
//        position: 'absolute',
//        top: 0,
//        left: 0,
//        right: 0,
//        //height: '1px', // Height of the top border
//        //background: '#d3d3d3', // Simple light grey color
//        borderTopLeftRadius: '4px',
//        borderTopRightRadius: '4px',
//    },
//    '&:hover': {
//        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)', // Slightly enhanced shadow on hover
//    },
//};
export const paperStyle = {
    p: 2,
    mb: 2,
    mt: 4,
    borderRadius: 4, // Smooth rounded corners
    backgroundColor: '#ffffff', // Clean white background
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px', // Height of the top shadow area
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
        backgroundColor: '#ffffff', // Matches the background for a seamless effect
        boxShadow: '0px -4px 6px rgba(0, 0, 0, 0.1)', // Top shadow
        zIndex: 1, // Ensures it sits above the element background
    },
    '&:hover': {
        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)', // Slightly enhanced shadow on hover
    },
};

