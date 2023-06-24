import { Alert } from "react-native";
//See https://reactnative.dev/docs/alert
export const showAlert = (title: string, message: string) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: "Close",
        style: "cancel",
      },
    ],
    {
      cancelable: true
    }
  );
}

export const showDeleteConfirmation = (title: string, message: string, id: number, deleteEntry: Function) => {
  
    Alert.alert(
      title,
      message,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteEntry(id)
        }
      ],
      {
        cancelable: true,
        /*onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog."
          ),*/
      }
    );
  }