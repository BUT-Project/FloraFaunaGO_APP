// import { useEffect } from 'react';
// import { toast } from '@backpackapp-io/react-native-toast';
// import { SuccessStore } from '@/context/zustand/store/useSuccessStore';

// interface SuccessPopupProps {
//   message: string;
//   visible: boolean;
// }

// export default function SuccessPopup({ message, visible }: SuccessPopupProps) {
//   const { setisVisible } = SuccessStore();

//   useEffect(() => {
//     if (visible) {
//       toast.success(message,{
//   animationType: 'spring',
// });
//       setTimeout(() => { 
//         setisVisible(false);
//       }, 3000); // Durée d’affichage du toast
//     }
//   }, [visible, message]);

//   return null;
// }