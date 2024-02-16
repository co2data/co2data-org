import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Form from './form'

export default function Login() {
  return (
    <section>
      <h1 className="my-6 font-bold text-4xl">Sign Up</h1>
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
