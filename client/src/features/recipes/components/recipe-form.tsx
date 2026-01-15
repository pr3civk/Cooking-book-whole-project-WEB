import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { queries, mutations } from "@/api/queries";
import {
  createRecipeRequestDto,
  type CreateRecipeRequestDto,
} from "@/api/schemas/recipe.schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StateContentSwap } from "@/components/ui/state-content-swap";
import { ImageUpload } from "./image-upload";
import { Plus, Trash2 } from "lucide-react";

type RecipeFormProps = {
  defaultValues?: Partial<CreateRecipeRequestDto>;
  onSubmit: (data: CreateRecipeRequestDto) => void;
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  submitLabel?: string;
};

export function RecipeForm({
  defaultValues,
  onSubmit,
  isPending,
  isSuccess,
  isError,
  submitLabel = "Create Recipe",
}: RecipeFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: categoriesData } = useQuery(queries.categories.all);
  const categories = Array.isArray(categoriesData?.data?.data)
    ? categoriesData?.data?.data ?? []
    : [];

  const form = useForm<CreateRecipeRequestDto>({
    resolver: zodResolver(createRecipeRequestDto),
    defaultValues: {
      title: "",
      description: "",
      ingredients: [""],
      instructions: [""],
      prepTime: undefined,
      cookTime: undefined,
      servings: undefined,
      difficulty: undefined,
      imageUrl: undefined,
      categoryId: undefined,
      ...defaultValues,
    },
  });

  const handleImageChange = (value: string | File | undefined) => {
    if (value instanceof File) {
      setImageFile(value);
      form.setValue("imageUrl", undefined);
    } else {
      setImageFile(null);
      form.setValue("imageUrl", value);
    }
    setUploadError(null);
  };

  const handleSubmit = async (data: CreateRecipeRequestDto) => {
    let imageUrl = data.imageUrl;

    if (imageFile) {
      setIsUploading(true);
      setUploadError(null);
      try {
        const response = await mutations.uploadImage(imageFile);
        imageUrl = response.data.url;
      } catch {
        setUploadError("Failed to upload image");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    onSubmit({ ...data, imageUrl });
  };

  const ingredients = useFieldArray({
    control: form.control,
    name: "ingredients" as never,
  });

  const instructions = useFieldArray({
    control: form.control,
    name: "instructions" as never,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>Image</FormLabel>
          <FormControl>
            <ImageUpload
              value={imageFile || form.watch("imageUrl")}
              onChange={handleImageChange}
            />
          </FormControl>
          {uploadError && (
            <p className="text-sm text-destructive">{uploadError}</p>
          )}
        </FormItem>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Recipe title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of your recipe"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(val) =>
                    field.onChange(val ? Number(val) : undefined)
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="prepTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prep Time (min)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="30"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cookTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cook Time (min)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="60"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="servings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Servings</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="4"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Ingredients</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => ingredients.append("")}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
          {ingredients.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={form.control}
                name={`ingredients.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="e.g., 2 cups flour" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {ingredients.fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => ingredients.remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Instructions</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => instructions.append("")}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Step
            </Button>
          </div>
          {instructions.fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <span className="flex h-10 w-8 shrink-0 items-center justify-center text-sm font-medium text-muted-foreground">
                {index + 1}.
              </span>
              <FormField
                control={form.control}
                name={`instructions.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="Describe this step..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {instructions.fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => instructions.remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={isPending || isUploading}>
          <StateContentSwap
            isLoading={isPending || isUploading}
            isSuccess={isSuccess}
            isError={isError}
          >
            {isUploading ? "Uploading image..." : submitLabel}
          </StateContentSwap>
        </Button>
      </form>
    </Form>
  );
}
