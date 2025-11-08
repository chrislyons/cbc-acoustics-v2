import { Link, useLocation } from 'react-router-dom'
import { Menu, Box, BarChart3, Sliders, Info } from 'lucide-react'
import { cn } from '../../lib/utils/cn'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Menu },
  { name: '3D Visualizer', href: '/visualizer', icon: Box },
  { name: 'Frequency Analysis', href: '/frequency', icon: BarChart3 },
  { name: 'Treatment Simulator', href: '/simulator', icon: Sliders },
  { name: 'About', href: '/about', icon: Info },
]

export function Header() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Box className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              CBC Studio 8 Acoustics
            </span>
          </Link>
        </div>

        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          {navigation.map(item => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center space-x-2 transition-colors hover:text-foreground/80',
                  isActive ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline-block">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
