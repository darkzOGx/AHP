'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { 
  Palette, 
  Upload, 
  Eye, 
  Save, 
  Building2, 
  Monitor,
  Sun,
  Moon
} from 'lucide-react';
import { toast } from 'sonner';

export default function OrganizationBrandingPage() {
  const { organization, hasPermission, loading, refetch } = useOrganization();
  const { user } = useAuth();
  
  // Branding state
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#EF4444');
  const [secondaryColor, setSecondaryColor] = useState('#64748B');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [customDomain, setCustomDomain] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const canManageSettings = hasPermission('manage_settings');

  useEffect(() => {
    if (organization?.branding) {
      setLogoUrl(organization.branding.logo || '');
      setPrimaryColor(organization.branding.primaryColor || '#EF4444');
      setSecondaryColor(organization.branding.secondaryColor || '#64748B');
      setTheme(organization.branding.theme || 'light');
      setCustomDomain(organization.branding.customDomain || '');
      setFaviconUrl(organization.branding.favicon || '');
    }
  }, [organization]);

  const handleSaveBranding = async () => {
    if (!organization || !user) return;

    setIsSaving(true);
    const db = getFirestore();

    try {
      await updateDoc(doc(db, 'organizations', organization.id), {
        branding: {
          logo: logoUrl.trim() || null,
          primaryColor: primaryColor,
          secondaryColor: secondaryColor,
          theme: theme,
          customDomain: customDomain.trim() || null,
          favicon: faviconUrl.trim() || null,
        },
        updatedAt: new Date(),
      });

      toast.success('Organization branding updated successfully');
      refetch();
    } catch (error) {
      console.error('Error updating organization branding:', error);
      toast.error('Failed to update organization branding');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setLogoUrl('');
    setPrimaryColor('#EF4444');
    setSecondaryColor('#64748B');
    setTheme('light');
    setCustomDomain('');
    setFaviconUrl('');
  };

  if (loading || !organization) {
    return <div>Loading...</div>;
  }

  if (!canManageSettings) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to manage organization branding.</p>
        </div>
      </div>
    );
  }

  const previewStyle = {
    borderColor: primaryColor + '40',
    backgroundColor: primaryColor + '08'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Palette className="w-8 h-8 text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organization Branding</h1>
            <p className="text-gray-600 mt-1">
              Customize your organization's appearance and branding
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Branding Settings */}
          <div className="space-y-6">
            {/* Logo Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Logo & Visual Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="logoUrl">Organization Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-sm text-gray-500">
                    Enter a URL to your organization's logo (recommended: 200x200px, PNG/SVG)
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="faviconUrl">Favicon URL</Label>
                  <Input
                    id="faviconUrl"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                  />
                  <p className="text-sm text-gray-500">
                    Custom favicon for your organization (32x32px ICO or PNG)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Color Theme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Color Theme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#EF4444"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        placeholder="#64748B"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Default Theme</Label>
                  <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'auto') => setTheme(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Light Theme
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark Theme
                        </div>
                      </SelectItem>
                      <SelectItem value="auto">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Auto (System)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="customDomain">Custom Subdomain</Label>
                  <Input
                    id="customDomain"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="yourorg"
                  />
                  <p className="text-sm text-gray-500">
                    Custom subdomain: yourorg.autohunterpro.com (Enterprise feature)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSaveBranding}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Branding
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                onClick={resetToDefaults}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Header Preview */}
                <div className="border-2 rounded-lg p-4 mb-4" style={previewStyle}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt="Logo preview"
                          className="w-8 h-8 object-contain rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Building2 className="w-8 h-8" style={{color: primaryColor}} />
                      )}
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{organization.name}</h2>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                          Enterprise Dashboard
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="px-3 py-1 rounded-full text-sm font-medium border"
                        style={{
                          backgroundColor: primaryColor + '20',
                          borderColor: primaryColor + '40',
                          color: primaryColor
                        }}
                      >
                        👑 Organization Owner
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Primary Color</p>
                    <div 
                      className="w-full h-12 rounded-lg border-2"
                      style={{backgroundColor: primaryColor}}
                    ></div>
                    <p className="text-xs text-gray-500 mt-1">{primaryColor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Secondary Color</p>
                    <div 
                      className="w-full h-12 rounded-lg border-2"
                      style={{backgroundColor: secondaryColor}}
                    ></div>
                    <p className="text-xs text-gray-500 mt-1">{secondaryColor}</p>
                  </div>
                </div>

                {/* Theme Preview */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected Theme</p>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    {theme === 'light' && <Sun className="w-4 h-4" />}
                    {theme === 'dark' && <Moon className="w-4 h-4" />}
                    {theme === 'auto' && <Monitor className="w-4 h-4" />}
                    <span className="text-sm capitalize">{theme} Theme</span>
                  </div>
                </div>

                {/* Domain Preview */}
                {customDomain && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm font-medium text-blue-800">Custom Domain</p>
                    <p className="text-sm text-blue-600">
                      {customDomain}.autohunterpro.com
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}