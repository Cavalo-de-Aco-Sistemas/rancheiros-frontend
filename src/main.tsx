/**
 * Enable custom date formats
 * https://mantine.dev/dates/date-input/#value-format
 */
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ReactDOM from 'react-dom/client';
import App from './App';

dayjs.extend(customParseFormat);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
