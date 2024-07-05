import { notification } from 'ant-design-vue' 
 
var notificationInstance = null 
 
export default (options) => {
  notificationInstance && notificationInstance.destroy();
  notificationInstance = notification.open(options);
}