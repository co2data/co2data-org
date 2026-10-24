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
      <h1 className="my-6 text-4xl font-bold">Login</h1>
      <Card className="max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login with your account</CardTitle>
          <CardDescription>
            Enter your user name below to login to your account.
          </CardDescription>
        </CardHeader>
        <Form
          submit={
            <CardFooter>
              <Button type="submit" className="w-full">
                Login
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
