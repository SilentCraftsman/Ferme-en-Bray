import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const notify = {
  info: (message, options = {}) => toast.info(message, options),
  success: (message, options = {}) => toast.success(message, options),
  warning: (message, options = {}) => toast.warning(message, options),
  error: (message, options = {}) => toast.error(message, options),
  default: (message, options = {}) => toast(message, options),
};

export default notify;
