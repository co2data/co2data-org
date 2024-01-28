import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Form from './form'
import { Label } from '@/components/ui/label'

export default function Login() {
  return (
    <section>
      <h1 className="my-6 text-4xl font-bold">Sign Up</h1>
      <Card className="max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your user name below to create your account.
          </CardDescription>
        </CardHeader>
        <Form
          submit={
            <CardFooter>
              <Button type="submit" className="w-full">
                Create account
              </Button>
            </CardFooter>
          }
        >
          <div className="grid gap-2">
            <Label htmlFor="username">User name</Label>
            <Input id="username" type="text" name="username" />
          </div>
        </Form>
      </Card>
    </section>
  )
}
