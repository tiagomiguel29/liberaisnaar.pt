import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <>
      {"success" in message && (
        <Alert>
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>{message.success}</AlertDescription>
        </Alert>
      )}
      {"error" in message && (
        <Alert variant="destructive">
          <AlertTitle>Erro!</AlertTitle>
          <AlertDescription>{message.error}</AlertDescription>
        </Alert>
      )}

      {"message" in message && (
        <Alert>
          <AlertTitle>Atenção!</AlertTitle>
          <AlertDescription>{message.message}</AlertDescription>
        </Alert>
      )}
  </>
  );
}
