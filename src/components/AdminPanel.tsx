import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import Table from './ui/table';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';

const AdminPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [gaId, setGaId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && isAdmin(user)) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [isOpen, user]);

  const fetchData = async () => {
    setLoading(true);
    const { data: usersData } = await supabase.from('users').select('*');
    setUsers(usersData || []);
    const { data: ordersData } = await supabase.from('orders').select('*');
    setOrders(ordersData || []);
    const { data: settingsData } = await supabase.from('settings').select('ga_tracking_id').single();
    setGaId(settingsData?.ga_tracking_id || '');
    setLoading(false);
  };

  const handleSaveGA = async () => {
    await supabase.from('settings').upsert({ id: 1, ga_tracking_id: gaId, updated_at: new Date().toISOString() });
    alert('Google Analytics ID saved!');
  };

  if (!isAdmin(user)) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose} shouldScaleBackground={false}>
      <DrawerContent className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50">
        <DrawerHeader>
          <DrawerTitle>Admin Panel & Analytics</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-8 overflow-y-auto h-[80vh]">
          <div>
            <h3 className="font-bold mb-2">Users</h3>
            <Table columns={["id", "email", "name", "insta_subscribed", "created_at"]} data={users} />
          </div>
          <div>
            <h3 className="font-bold mb-2">Orders</h3>
            <Table columns={["order_id", "user_id", "total_amount", "payment_method", "transaction_id", "status", "created_at"]} data={orders} />
          </div>
          <div>
            <h3 className="font-bold mb-2">Google Analytics</h3>
            <input
              type="text"
              value={gaId}
              onChange={e => setGaId(e.target.value)}
              placeholder="GA Tracking ID"
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <Button onClick={handleSaveGA} className="bg-brand-blue text-white w-full">Save</Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AdminPanel; 