import { useSelector } from 'react-redux';

const CustomSpinner = () => {
    const { isDarkMode, theme } = useSelector((state) => state.theme);
      const currentTheme = isDarkMode ? theme.dark : theme.light;
  return (
      <div className={`fixed inset-0 flex items-center justify-center ${currentTheme.primary} z-50`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
}

export default CustomSpinner
