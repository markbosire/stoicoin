const API_URL = "http://localhost:3001";

const registerButton = document.getElementById(
  "register-button"
) as HTMLButtonElement;
const nodeUrlInput = document.getElementById("node-url") as HTMLInputElement;
const broadcastButton = document.getElementById(
  "broadcast-button"
) as HTMLButtonElement;
const broadcastMessageInput = document.getElementById(
  "broadcast-message"
) as HTMLInputElement;

let registeredNodes: string[] = [];

registerButton.addEventListener("click", async () => {
  const newNodeUrl = nodeUrlInput.value.trim();
  let error: any;
  if (!newNodeUrl) {
    return alert("Please enter a valid node URL");
  }

  try {
    const response = await fetch(`${API_URL}/register-and-broadcast-node`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newNodeUrl,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to register node.");
    }

    alert("Node registered successfully");
  } catch (error: any) {
    alert(error.message);
  }
});
