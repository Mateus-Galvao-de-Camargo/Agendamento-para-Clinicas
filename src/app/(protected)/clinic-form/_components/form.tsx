"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { createClinic } from "@/actions";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const ClinicForm = () => {
  const clinicSchema = z.object({
    name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  });

  const form = useForm<z.infer<typeof clinicSchema>>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof clinicSchema>) {
    try {
      await createClinic(values.name);
    } catch (error) {
      if (isRedirectError(error)) {
        return;
      }
      console.error(error);
      toast.error("Erro ao criar clínica");
    }
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Criar Clínica
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default ClinicForm;
