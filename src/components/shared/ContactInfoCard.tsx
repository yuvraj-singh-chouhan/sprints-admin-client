import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  User,
  Building
} from 'lucide-react';

interface ContactInfoProps {
  title: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  status: string;
  createdAt: string;
  avatar?: string;
  contactPerson?: string; // For vendors
  icon?: ReactNode;
  statusVariant?: 'default' | 'secondary' | 'destructive';
}

const ContactInfoCard = ({
  title,
  name,
  email,
  phone,
  address,
  status,
  createdAt,
  avatar,
  contactPerson,
  icon,
  statusVariant = 'default'
}: ContactInfoProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {icon}
            {title}
          </CardTitle>
          <Badge variant={statusVariant} className="capitalize animate-in fade-in duration-300">
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 ring-2 ring-admin-primary/20">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-admin-primary/10 text-admin-primary font-semibold text-lg">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 truncate">{name}</h3>
            {contactPerson && (
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <User className="h-3 w-3" />
                Contact: {contactPerson}
              </p>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 group">
              <Mail className="h-4 w-4 text-gray-400 mt-0.5 group-hover:text-admin-primary transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm text-gray-900 truncate">{email}</p>
              </div>
            </div>

            {phone && (
              <div className="flex items-start space-x-3 group">
                <Phone className="h-4 w-4 text-gray-400 mt-0.5 group-hover:text-admin-primary transition-colors" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3 group">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5 group-hover:text-admin-primary transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-sm text-gray-900 leading-relaxed">{address}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 group">
              <Calendar className="h-4 w-4 text-gray-400 mt-0.5 group-hover:text-admin-primary transition-colors" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500">
                  {contactPerson ? 'Partner Since' : 'Member Since'}
                </p>
                <p className="text-sm text-gray-900">{formatDate(createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard; 