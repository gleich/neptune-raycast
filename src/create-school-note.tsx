import { Action, ActionPanel, closeMainWindow, Form, showHUD, showToast, Toast } from "@raycast/api";
import { readConfig } from "./config";
import { execa } from "execa";
import { useState } from "react";

interface Values {
  name: string;
  category: string;
  class: string;
  folder: string;
}

export default function Command() {
  const config = readConfig();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: Values) => {
    await showToast({ title: `Creating ${values.name}...`, style: Toast.Style.Animated });
    setIsLoading(true);
    await execa("/Users/matt/.cargo/bin/neptune", [
      "school-note",
      "--class",
      values.class,
      "--category",
      values.category,
      "--folder",
      values.folder,
      "--name",
      values.name,
    ]);
    setIsLoading(false);
    await closeMainWindow();
    await showHUD(`Created ${values.name}`);
  };

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create" onSubmit={onSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Name" placeholder="Name" />
      <Form.Dropdown id="category" title="Category" defaultValue="Notes">
        <Form.Dropdown.Item value="Notes" title="Notes" />
        <Form.Dropdown.Item value="Practice" title="Practice" />
        <Form.Dropdown.Item value="Assessment" title="Assessment" />
        <Form.Dropdown.Item value="Worksheets" title="Worksheets" />
      </Form.Dropdown>
      <Form.Dropdown id="class" title="Classes">
        {config.classes.map((c) => (
          <Form.Dropdown.Item key={c.id} value={c.name} title={c.id + ": " + c.name} />
        ))}
      </Form.Dropdown>
      <Form.TextField id="folder" title="Folder" placeholder="Folder" />
    </Form>
  );
}
